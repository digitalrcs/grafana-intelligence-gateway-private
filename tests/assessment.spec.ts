import { test, expect } from './fixtures';
import type { Request } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test('presets, evidence, brief export and follow-ups stay attached to the original assessment', async ({
  page,
  gotoDashboardPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const view = await gotoDashboardPage({ uid: dashboard.uid });
  const panel = view.getPanelByTitle('Explain the traffic shift').locator;
  const calls: Request[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && new URL(request.url()).pathname.endsWith('/resources/chat/completions')) {
      calls.push(request);
    }
  });
  await panel.scrollIntoViewIfNeeded();
  await view.waitForPanelsQueriesToComplete({ timeout: 30000 });
  await panel.getByRole('button', { name: 'Analyze', exact: true }).click();
  await expect(panel).toContainText('Automated UI test response.');
  expect(calls).toHaveLength(1);
  const original = calls[0].postDataJSON();
  expect(original.prompt.user).toContain('statistics');
  await panel.getByText(/^Evidence ·/).click();
  await expect(panel).toContainText('Assessed:');
  await expect(panel).toContainText('rows omitted');
  await panel.getByRole('combobox', { name: 'Analysis task' }).click();
  await page.getByText('Check data quality', { exact: true }).click();
  await expect(panel).toContainText('Assessment is out of date');
  await panel.getByText('Ask a follow-up', { exact: true }).click();
  await panel.getByRole('textbox', { name: 'Follow-up question' }).fill('Which series contributed most?');
  await panel.getByRole('button', { name: 'Ask follow-up', exact: true }).click();
  await expect(panel).toContainText('1/6 follow-ups used');
  expect(calls).toHaveLength(2);
  expect(calls[1].postDataJSON().prompt.user).toContain(original.prompt.user);
  await panel.getByText('Share assessment', { exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await panel.getByRole('button', { name: 'Download brief', exact: true }).click();
  const download = await downloadPromise;
  const brief = await readFile((await download.path())!, 'utf8');
  expect(brief).toContain('Which series contributed most?');
  expect(brief).toContain(dashboard.uid);
  expect(brief).not.toContain('"rows":');
  expect(brief).not.toContain('data:image/');
  await panel.getByRole('button', { name: 'Analyze latest data', exact: true }).click();
  await expect(panel).not.toContainText('Assessment is out of date');
  await expect(panel).toContainText('Automated UI test response.');
  expect(calls).toHaveLength(3);
  expect(calls[2].postDataJSON().prompt.system).toContain('Assess missing or invalid supplied values');
  if (process.env.VISION_EVIDENCE_DIR) {
    await page.screenshot({ path: path.join(process.env.VISION_EVIDENCE_DIR, 'assessment-tools.png') });
  }
});
