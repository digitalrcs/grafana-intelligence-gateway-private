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
