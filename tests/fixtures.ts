import { test as base, expect, Dashboard } from '@grafana/plugin-e2e';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { VISION_LIMITS } from '../src/vision/limits';

// Browser-only response fixtures. No AI simulator is shipped, provisioned or started.
// These tests do not prove live inference; live-backend.spec.ts covers an explicitly selected backend.
export { expect, gte } from '@grafana/plugin-e2e';
export type { Dashboard } from '@grafana/plugin-e2e';
export const test = base.extend<{
  testBackend: { uid: string; name: string; jsonData: Record<string, unknown> };
  testDataUid: string;
}>({
  testDataUid: async ({ request }, use) => {
    const uid = `ui-data-${randomUUID().slice(0, 20)}`;
    expect(
      (
        await request.post('/api/datasources', {
          data: {
            uid,
            name: `Synthetic test data ${uid}`,
            type: 'grafana-testdata-datasource',
            access: 'proxy',
          },
        })
      ).ok()
    ).toBe(true);
    try {
      await use(uid);
    } finally {
      expect((await request.delete(`/api/datasources/uid/${uid}`)).ok()).toBe(true);
    }
  },
  testBackend: async ({ page, request }, use) => {
    const uid = `ui-contract-${randomUUID().slice(0, 20)}`;
    const source = {
      uid,
      name: `Automated test connection ${uid}`,
      type: 'digitalrcs-intelligencegateway-datasource',
      access: 'proxy',
      jsonData: {
        provider: 'custom',
        baseUrl: 'https://inference.invalid/v1',
        defaultModel: 'test-model',
        allowedModels: ['test-model'],
        enableVision: true,
        allowedVisionModels: ['test-model'],
      },
    };
    expect((await request.post('/api/datasources', { data: source })).ok()).toBe(true);
    await page.route(`**/api/datasources/uid/${uid}/resources/**`, async (route) => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname.endsWith('/chat/completions')) {
        const payload = route.request().postDataJSON();
        await route.fulfill({
          json: {
            choices: [
              {
                message: {
                  content: `Automated UI test response.\n\nImage request: ${payload.images?.length ?? 0} image(s) received.`,
                },
              },
            ],
          },
        });
      } else if (pathname.endsWith('/models')) {
        await route.fulfill({ json: { data: [{ id: 'test-model' }] } });
      } else if (pathname.endsWith('/capabilities')) {
        await route.fulfill({
          json: {
            provider: 'custom',
            generationControls: { temperature: true, maxOutputTokens: true },
            vision: {
              enabled: true,
              models: ['test-model'],
              mimeTypes: ['image/png', 'image/jpeg'],
              limits: VISION_LIMITS,
            },
          },
        });
      } else {
        await route.continue();
      }
    });
    try {
      await use(source);
    } finally {
      expect((await request.delete(`/api/datasources/uid/${uid}`)).ok()).toBe(true);
    }
  },
  readProvisionedDataSource: async ({ testBackend }, use) => {
    await use(async () => testBackend as never);
  },
  readProvisionedDashboard: async ({ testBackend, testDataUid, request }, use) => {
    const dashboards: string[] = [];
    await use(async ({ fileName }) => {
      const source = JSON.parse(
        (await readFile(path.join(__dirname, 'fixtures', fileName), 'utf8')).replaceAll('trlxrdZVk', testDataUid)
      );
      source.id = null;
      source.uid = `ui-panel-${randomUUID().slice(0, 20)}`;
      source.version = 0;
      for (const panel of source.panels) {
        if (panel.type === 'digitalrcs-intelligencegateway-panel') {
          panel.options.secureDataSourceUid = testBackend.uid;
          panel.options.model = 'test-model';
        }
      }
      expect((await request.post('/api/dashboards/db', { data: { dashboard: source, overwrite: false } })).ok()).toBe(
        true
      );
      dashboards.push(source.uid);
      return source as Dashboard;
    });
    for (const uid of dashboards) {
      expect((await request.delete(`/api/dashboards/uid/${uid}`)).ok()).toBe(true);
    }
  },
});
