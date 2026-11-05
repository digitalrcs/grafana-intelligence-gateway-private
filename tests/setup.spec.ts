import { test, expect } from '@grafana/plugin-e2e';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('fresh installation requires an AI connection and has no demo provider', async ({
  gotoDashboardPage,
  request,
  page,
}, info) => {
  const dashboard = JSON.parse(
    await readFile(path.join(__dirname, '../provisioning/dashboards/dashboard.json'), 'utf8')
  );
  dashboard.id = null;
  dashboard.uid = `setup-${randomUUID().slice(0, 20)}`;
  expect((await request.post('/api/dashboards/db', { data: { dashboard, overwrite: false } })).ok()).toBe(true);
  try {
    await gotoDashboardPage({ uid: dashboard.uid });
    const panel = page.getByTestId('intelligence-gateway-panel');
    await expect(panel).toContainText('Connect your AI backend');
    await expect(panel.getByRole('button', { name: 'Analyze', exact: true })).toBeDisabled();
    await expect(panel).not.toContainText(/mock|receipt/i);
    await expect(panel.getByRole('link', { name: 'Add AI connection' })).toBeVisible();
    if (process.env.VISION_EVIDENCE_DIR) {
      await page.screenshot({
        path: path.join(process.env.VISION_EVIDENCE_DIR, 'clean-setup.png'),
        animations: 'disabled',
      });
    }
  } finally {
    expect((await request.delete(`/api/dashboards/uid/${dashboard.uid}`)).ok()).toBe(true);
  }
});
