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

---

## Historical 1.2.0-private.1 validation

The following record describes the earlier build, not the current module.

# Private Docker validation — November 5, 2026

Running: http://localhost:3001/d/digitalrcs-demo-showcase/digitalrcs-demo-showcase

- Grafana Enterprise 13.3.0, private AI panel 1.2.0-private.1.
- Image: digitalrcs/demo-grafana:13.3.0-private. Existing named storage retained.
- Three saved dashboards unchanged. Datasource settings unchanged by initial deployment; vision was subsequently enabled with the user's explicit approval for the current LM Studio model.
- Live provider: LM Studio, qwen3.8-27b-heretic-abliterated-uncensored. No mock provider or fallback.
- Live text analysis: successful, 861 response characters. Exporter PNG download: 862 x 1094, 272429 bytes.
- Live image analysis: successful HTTP 200, one explicit inference request, 765 response characters. This proves image transport and a visible response, not an independent assessment of model reasoning accuracy; query rows were also included.
- Capture/preview generated no inference requests. Query count stayed at 1 before and after capture and analysis on the tested, already-loaded dashboard.
- Initial visual inspection found intermittent blank content in full-dashboard capture. Added a bounded 400 ms DOM quiet interval and two paint frames before capture, with a 5-second per-panel ceiling and existing cancellation/overall timeout behavior.
- After the fix: three fresh-browser runs passed dashboard and selected-panel capture with actual Time Overlay chart-color checks, zero extra queries and zero inference. Four Playwright checks passed including authentication. Diagnostic sampling was removed for these runs.
- Typecheck, production build and lint passed (existing deprecation warnings remain); all 96 unit tests passed.
- No uncaught browser errors. Two Grafana saved-query-preference 404 responses were recorded and verified as the expected missing user-storage entry; see saved-query-diagnostic.json.
- Running module.js SHA256 matches the local build: 8a6dfd3b2a7744ea6f7d2e771e2ba6ff370bd92cad9810459f05e917bd0a96d5.

## Evidence

runtime.json records versions, signatures, storage and vision settings. before.json and after.json match before enabling vision; final.json reflects that approved setting change. browser-evidence.json and vision-evidence.json record live-provider checks. capture-only-evidence.json records the final repeat. [AI dashboard capture](images/private-dashboard-capture.png) contains the chart, overlay and guide; the empty AI-panel position is intentionally excluded. [live image analysis](images/private-image-analysis.png) shows the explicit image-analysis response.

## Use and remaining release work

Start normally with digitalrcs-demo-grafana/Start-Demo.ps1. After private panel changes use -RebuildPanel. Startup rejects a wrong edition and checks the packaged panel version. Use a hard browser refresh after updates.

This is an unsigned, loopback-only development demo with synthetic data. It is not the internal deployment package or Grafana private certification. Coordinate signing organization and exact internal Grafana root URLs with Grafana, sign immutable panel and companion release artifacts, and validate them on the target environment. The local companion remains 1.1.0; the separate datasource security release must be considered when preparing production packages.

No public repository push, release, catalog submission or private signing was performed. Prior image retained as digitalrcs/demo-grafana:before-private-20261105. No volume was deleted.

The no-requery observation applies to this test. Scrolling previously unloaded panels can trigger initial queries; normal scheduled Grafana refreshes can still occur. The render-settling wait reduces the observed race but cannot guarantee readiness for every third-party visualization or asynchronous canvas update.

The evidence files named above are retained locally under C:\Data\GrafanaAIPlugin\local-updates\private-docker-20261105. Only the selected synthetic screenshots are included here. CI in this new internal-edition repository must be assessed separately.
