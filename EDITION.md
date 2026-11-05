# Private internal edition — 1.2.0-private.1 (unreleased)

This project retains the full 1.1.2 feature set, including dashboard capture, selected-panel capture, PNG/JPEG uploads and query-data analysis. The private Docker validation added a bounded quiet-window and paint wait before capture to reduce intermittent blank content after scrolling.
The independent public project is C:\Data\GrafanaAIPluginPublic\digitalrcs-intelligencegateway-panel. Do not use this folder for public catalog changes.

## Distribution boundary

No public release workflow is present. npm publishing is disabled by package.json private:true.
The intended origin is https://github.com/digitalrcs/grafana-intelligence-gateway-private. This public source repository is distinct from grafana-intelligence-gateway, which serves the no-DOM catalog edition. Do not push internal-edition changes to that separate repository.
Private signing requires GRAFANA_ACCESS_POLICY_TOKEN (plugins:write) and GRAFANA_PRIVATE_ROOT_URLS matching the internal Grafana root_url values. Run npm run build, then npm run sign. Never commit tokens. Signing has not yet been performed for this edition.
Private signatures are restricted to those URLs and are not public catalog certification. Confirm eligibility with Grafana for any customer deployment; this edition is intended only for internal use.

Both editions keep the existing plugin ID so dashboards remain compatible. Install one edition per Grafana instance, replace the whole plugin directory, and restart Grafana. Do not mix files or manifests across editions. The localhost Docker demo now runs this private edition; see VALIDATION.md for runtime evidence.

## Behavior and validation

Use Grafana's Dashboard data source to reuse another panel's results. Capture does not deliberately refresh queries, but scrolling can cause initial lazy-panel loads and scheduled refreshes can still occur. Uploads remain PNG/JPEG only.
Run npm ci, npm run typecheck, npm run lint, npm run test:ci and npm run build. Browser capture regression tests remain in tests/vision.spec.ts.
Historical public release instructions describe prior versions and must not be used to distribute this private edition.

See VALIDATION.md for verified checks and pending browser/signing work.

## Source versus Grafana distribution

The GitHub repository and wiki are public by owner request. Private means this full-featured edition is intended for internal Grafana deployment and private signing, not distribution through the public Grafana plugin catalog. The separate catalog edition removes cross-panel DOM capture. Public source visibility does not establish Grafana approval. Never commit credentials, customer data or target-specific private configuration.
