# Private feature validation — November 5, 2026

Version: **1.2.0-private.2**, unsigned internal development build. Public source; private Grafana signing and deployment approval remain pending.

- TypeScript, production webpack build and edition guard passed.
- ESLint: 0 errors, 12 Grafana API-deprecation warnings.
- Unit tests: **119 passed across 13 suites**.
- Final browser run: **19 passed**, including authentication, actual LM Studio data/image assessments and frozen follow-ups, presets, stale evidence, Markdown export, clean setup, image upload, selected/dashboard capture, desktop/narrow labels, and tall-dashboard pixel/scroll restoration.
- Live verification used the existing LM Studio connection and its configured model with synthetic DC1/DC2 measurements. Four actual requests completed: data assessment, data follow-up, captured-image assessment, image follow-up. The image follow-up sent identical original image bytes; query count stayed unchanged after initial loading. This verifies the tested transport/workflow, not independent model reasoning accuracy or a universal zero-query guarantee.
- The other browser tests use disposable backend-response fixtures scoped to the browser. No simulator service, mock provider configuration, default model, or canned-response runtime is bundled. New installations require an actual AI connection and explicitly selected model.
- Docker on localhost:3001 is healthy: Grafana Enterprise 13.3.0 with panel 1.2.0-private.2. Existing storage and customized dashboards were retained; tests created and removed separately named synthetic resources.
- Running and built module.js SHA256 match: `77bc7a7ca34979d36f19baa3990081fc34bfd517fb917cbec0b6289f9052203a`.
- Dependency audit high-severity gate passed: 0 high/critical; 7 low and 16 moderate dependency findings remain.

## Scope and limitations

Browser plugin was not available; validation used the repository's @grafana/plugin-e2e Playwright workflow on Chromium, with desktop and 390px capture-layout coverage. Browser identity/content, uncaught errors, captures, request counts and explicit-send behavior were checked. Known optional Grafana missing-configuration diagnostics are narrowly classified in tests.

Evidence summaries describe submitted samples and supplied row order. Missing-value counts do not infer absent timestamps. Counter increases require usable adjacent samples and valid increasing times when supplied. Baseline comparison uses two existing query results; it does not retrieve history. Image freshness cannot detect changes to other panels' pixels without a new capture. Follow-ups reuse the frozen data/images and do not recapture.

Local evidence is in `../local-updates/private-features-20261105/` outside the source repository. No production endpoints, customer data, access tokens, private signatures or release artifacts were published.

## Reproduce

Run `npm run typecheck`, `npm run lint`, `npm run test:ci`, and `npm run build`. Rebuild the maintained shared Docker stack with `Start-Demo.ps1 -RebuildPanel`.

Run `npx playwright test --workers=1` with `GRAFANA_URL` pointing to the intended local instance. Ordinary tests create disposable synthetic resources. The live test runs only when both `LIVE_AI_DATASOURCE_UID` and `LIVE_AI_MODEL` explicitly select the approved real connection/model; it uses synthetic data and removes its dashboard/data source afterward. `VISION_EVIDENCE_DIR` optionally saves screenshots outside this repository.
