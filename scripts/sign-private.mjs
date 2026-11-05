import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const built = JSON.parse(readFileSync('dist/plugin.json', 'utf8'));
const source = JSON.parse(readFileSync('src/plugin.json', 'utf8'));
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
assert.equal(built.name, source.name, 'Build the private edition before signing.');
assert.equal(built.info.version, pkg.version, 'Build the current private version before signing.');
const roots = process.env.GRAFANA_PRIVATE_ROOT_URLS;
if (!roots || !process.env.GRAFANA_ACCESS_POLICY_TOKEN) {
  throw new Error(
    'Set GRAFANA_PRIVATE_ROOT_URLS to the exact internal Grafana root_url values and provide GRAFANA_ACCESS_POLICY_TOKEN securely.'
  );
}
for (const value of roots.split(',')) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Private root URLs must be HTTP(S) Grafana URLs without credentials, queries or fragments.');
  }
}
const result = spawnSync(process.execPath, ['node_modules/@grafana/sign-plugin/dist/bin/run.js', '--rootUrls', roots], {
  stdio: 'inherit',
});
if (result.error) {
  throw result.error;
}
process.exit(result.status ?? 1);
