import { test, expect } from '@grafana/plugin-e2e';
import { randomUUID } from 'node:crypto';
import type { Request } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test('real backend completes data and captured-image assessments with frozen follow-ups', async ({
  page,
  request,
  gotoDashboardPage,
}, info) => {
  test.setTimeout(720000);
  const sourceUid = process.env.LIVE_AI_DATASOURCE_UID;
  const model = process.env.LIVE_AI_MODEL;
  test.skip(!sourceUid || !model, 'Set an explicitly approved live backend UID and model to run inference.');
  const source = await request.get(`/api/datasources/uid/${sourceUid}`);
  expect(source.ok()).toBe(true);
  expect((await source.json()).type).toBe('digitalrcs-intelligencegateway-datasource');
  const testDataUid = `live-data-${randomUUID().slice(0, 20)}`;
  expect(
    (
      await request.post('/api/datasources', {
        data: {
          uid: testDataUid,
          name: `Live verification synthetic data ${testDataUid}`,
          type: 'grafana-testdata-datasource',
          access: 'proxy',
        },
      })
    ).ok()
  ).toBe(true);
  const dashboard = JSON.parse(
    (await readFile(path.join(__dirname, 'fixtures/dashboard.json'), 'utf8')).replaceAll('trlxrdZVk', testDataUid)
  );
  dashboard.panels = dashboard.panels.filter((panel: { id: number }) => panel.id !== 3);
  dashboard.id = null;
  dashboard.uid = `live-panel-${randomUUID().slice(0, 20)}`;
  dashboard.version = 0;
  dashboard.title = 'Live AI verification';
  const panelConfig = dashboard.panels.find((panel: { id: number }) => panel.id === 2);
  panelConfig.options = {
    ...panelConfig.options,
    secureDataSourceUid: sourceUid,
    model,
    maxTokens: 8192,
    responseLengthTokens: 300,
    responseTimeoutSeconds: 300,
    metricKind: 'gauge',
    responseTitle: 'Traffic assessment',
    userPromptTemplate:
      'In at most 100 words, identify the supplied DC1/DC2 traffic shift. State the combined rate and distinguish facts from possible causes.\n{{data}}',
  };
  expect((await request.post('/api/dashboards/db', { data: { dashboard, overwrite: false } })).ok()).toBe(true);
  const errors: string[] = [];
  const inference: Request[] = [];
  let queries = 0;
  page.on('request', (request) => {
    const pathname = new URL(request.url()).pathname;
    if (request.method() === 'POST' && pathname.endsWith('/resources/chat/completions')) {
      inference.push(request);
    }
    if (request.method() === 'POST' && pathname === '/api/ds/query') {
      queries++;
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    const view = await gotoDashboardPage({ uid: dashboard.uid });
    await view.waitForPanelsQueriesToComplete({ scrollAll: true, timeout: 30000 });
    const panel = view.getPanelByTitle(panelConfig.title).locator.getByTestId('intelligence-gateway-panel');
    const queryBaseline = queries;
    await panel.getByRole('button', { name: 'Analyze', exact: true }).click();
    await expect(panel.getByText('Ask a follow-up', { exact: true })).toBeVisible({ timeout: 300000 });
    await expect(panel).toContainText(/DC1|DC2/);
    await expect(panel).not.toContainText(/Automated UI test response|mock receipt/i);
    await panel.getByText('Ask a follow-up', { exact: true }).click();
    await panel
      .getByRole('textbox', { name: 'Follow-up question' })
      .fill('In one sentence, can these measurements establish the cause?');
    await panel.getByRole('button', { name: 'Ask follow-up', exact: true }).click();
    await expect(panel).toContainText('1/6 follow-ups used', { timeout: 300000 });
    await panel.getByText('Ask a follow-up', { exact: true }).click();
    await panel.getByRole('button', { name: 'Refresh assessment' }).scrollIntoViewIfNeeded();
    const destination = process.env.VISION_EVIDENCE_DIR
      ? path.join(process.env.VISION_EVIDENCE_DIR, 'live-clean-assessment.png')
      : info.outputPath('live-clean-assessment.png');
    await page.screenshot({ path: destination, animations: 'disabled' });
    expect(errors).toEqual([]);
    await info.attach('live-assessment-text', { body: await panel.innerText(), contentType: 'text/plain' });
    expect(inference).toHaveLength(2);
    expect(inference[1].postDataJSON().prompt.user).toContain(inference[0].postDataJSON().prompt.user);
    expect(queries).toBe(queryBaseline);
    await panel.getByRole('button', { name: 'Clear analysis', exact: true }).click();
    await panel.getByRole('button', { name: 'Images', exact: true }).click();
    const dialog = page.getByTestId('image-inputs');
    const sourcePanel = dashboard.panels.find((item: { type: string }) => item.type === 'timeseries');
    await dialog.getByRole('checkbox', { name: sourcePanel.title, exact: true }).check({ force: true });
    await dialog.getByRole('button', { name: 'Capture selected panels', exact: true }).click();
    await expect(dialog.getByTestId('image-preview')).toHaveCount(1, { timeout: 45000 });
    expect(inference).toHaveLength(2);
    await dialog.getByRole('button', { name: 'Use images', exact: true }).click();
    await panel.getByRole('button', { name: 'Analyze images', exact: true }).click();
    await expect(panel.getByText('Ask a follow-up', { exact: true })).toBeVisible({ timeout: 300000 });
    await expect(panel).toContainText('Submitted 1 image.');
    expect(inference).toHaveLength(3);
    await panel.getByText('Ask a follow-up', { exact: true }).click();
    await panel
      .getByRole('textbox', { name: 'Follow-up question' })
      .fill('In one sentence, what does the original image show?');
    await panel.getByRole('button', { name: 'Ask follow-up', exact: true }).click();
    await expect(panel).toContainText('1/6 follow-ups used', { timeout: 300000 });
    expect(inference).toHaveLength(4);
    expect(inference[3].postDataJSON().images).toEqual(inference[2].postDataJSON().images);
    expect(queries).toBe(queryBaseline);
    await panel.getByText('Ask a follow-up', { exact: true }).click();
    await panel.getByRole('button', { name: 'Refresh assessment' }).scrollIntoViewIfNeeded();
    await page.screenshot({
      path: process.env.VISION_EVIDENCE_DIR
        ? path.join(process.env.VISION_EVIDENCE_DIR, 'live-image-assessment.png')
        : info.outputPath('live-image-assessment.png'),
      animations: 'disabled',
    });
    expect(errors).toEqual([]);
    await info.attach('live-request-evidence', {
      body: JSON.stringify({
        requests: inference.length,
        queryBaseline,
        finalQueries: queries,
        identicalFollowUpImages:
          JSON.stringify(inference[3].postDataJSON().images) === JSON.stringify(inference[2].postDataJSON().images),
      }),
      contentType: 'application/json',
    });
  } finally {
    expect((await request.delete(`/api/dashboards/uid/${dashboard.uid}`)).ok()).toBe(true);
    expect((await request.delete(`/api/datasources/uid/${testDataUid}`)).ok()).toBe(true);
  }
});
