import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
assert.equal(JSON.parse(readFileSync('EDITION.json')).edition, 'private');
assert.equal(JSON.parse(readFileSync('package.json')).private, true);
assert(existsSync('src/vision/capture.ts'));
assert(!existsSync('.github/workflows/release.yml'), 'Public release workflow must not exist in private edition.');
console.log('PRIVATE edition: internal distribution only; capture retained.');
