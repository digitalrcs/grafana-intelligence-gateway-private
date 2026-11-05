# Development and local setup

This guide covers the development environment and release workflow. For product setup, see the [user documentation](https://github.com/digitalrcs/grafana-intelligence-gateway-private/wiki).

## Requirements

Use Node.js 22 and the npm version declared in `package.json`, Docker, and Docker Compose. The scaffold CLI supports Linux/macOS; use WSL for scaffolding on Windows.

The integrated environment expects the companion [secure AI data source](https://github.com/digitalrcs/grafana-intelligence-gateway-datasource) in the sibling `../digitalrcs-intelligencegateway-datasource` directory. Panel 1.1.0 requires companion 1.1.0 or later. Build its frontend and Linux backend first, following that repository's instructions. Grafana 11.6 or later is required; the optional Grafana LLM app can impose a higher minimum (app 1.2.0 requires Grafana 13).

## Run locally

The default Compose image is `Dockerfile.review`: Grafana's official entrypoint in production application mode, with only the two review plugin IDs explicitly allowed unsigned. It does not inject the scaffold's live-reload script. This is a local review fixture, not a hardened public service; never expose anonymous administrator access. To explicitly use scaffold hot reload for local development, set `GRAFANA_DOCKERFILE=Dockerfile`, `GRAFANA_APP_MODE=development`, and `DEVELOPMENT=true`; do not use that profile for release validation or as a cache workaround.

The integrated review image disables the unrelated preinstalled `grafana-assistant-app` using Grafana's documented [disable_plugins setting](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/#disable_plugins). The standalone fixture has no Assistant service/account; otherwise that app can make failing background requests. This is not `grafana-llm-app`, does not disable any Intelligence Gateway provider, and does not change an existing Grafana installation. Browser tests still fail on unexpected errors, including provider errors.

From the panel repository:

```bash
npm install
npm run dev
```

In a second terminal:

```bash
docker compose up
```

Open <http://localhost:3004>. Compose mounts both plugins and supplies an unconfigured starter dashboard. Configure a real Secure AI data-source instance, select it and an approved model under **1. Connect AI**, and add the intended measurements separately under **Queries**. No mock AI server, canned response provider or automatic model choice is bundled. Follow [Panel setup](SETUP.md).

The development container enables anonymous Admin access. Do not use that configuration for a production deployment.

Synthetic traffic-shift and capture dashboards belong to the isolated automated test fixtures. `npm run sync:test-data` updates those fixtures from `testdata/reviewer-traffic.csv`; it does not turn the user starter dashboard into a demo or configure an AI connection.

For LM Studio on the Docker Desktop host, use `http://host.docker.internal:1234/v1`; container `localhost` means the Grafana container. Another host requires an address reachable from Grafana, approved LM Studio network access, and firewall routing. Prefer HTTPS; any HTTP exception must be explicitly enabled in the companion and confined to a trusted environment. The exception does not bypass model, redirect, payload, timeout, or other network policy.

## Build and test

```bash
npm run typecheck
npm run lint
npm run test:ci
npm run build
npm run e2e
```

Browser tests use a dedicated Grafana instance and isolated synthetic fixtures. Temporary request interception in the test harness verifies UI behavior without providing an installed fake AI service. Those checks do not prove real inference, provider authentication or vision quality. Unit-test mocks remain test-only. See the test configuration for the separately opt-in live-provider checks; use approved synthetic evidence and a configured real provider for that validation.

Image tests require version-compatible builds of both repositories (1.1.0 or later). Tests cover preview without inference, selected/dashboard capture, upload, explicit submission, exclusion of Intelligence Gateway panels, cancellation, clearing and layout. Check data-only, images-only and combined requests separately. New frozen-snapshot checks must verify original data/images are reused after refresh, and that Clear analysis and connection changes discard them. Follow [Image Analysis](IMAGE_ANALYSIS.md) for limits and provider setup.

Use the compatible companion revision selected by CI. Do not skip tests to make incompatible builds appear supported. Keep routine isolated browser tests separate from live-provider validation; interception cannot establish upstream model quality. Preview-only checks must verify that preparing a capture does not trigger inference. Run the compatibility matrix against the exact proposed release pair before claiming support.

The webpack build packages **`src/README.md`** as `dist/README.md`; the root README is the repository landing page. Keep their product descriptions consistent. Catalog screenshots and SVG plugin icons are copied from the paths declared in `src/plugin.json`. Restart Grafana after changes to plugin metadata.

The catalog analysis screenshot is an unchanged copy of [the recorded live LM Studio capture](images/reviewer-live-assessment.png). The [DigitalRCS logo](images/digitalrcs-logo.webp) is the original asset from [digitalrcs.com](https://digitalrcs.com/assets/images/digitalrcs-logo.webp), retrieved September 27, 2026.

### Rebuilt code still looks unchanged

Grafana can keep a plugin loaded for the lifetime of a page, and filesystem plugin URLs can use the plugin version as their cache key. Rebuilding the same development version may therefore leave an existing tab using older JavaScript even after refreshing dashboard data. Verify the exact served `module.js` against the built file before diagnosing a new code defect. In browser developer tools, temporarily enable **Network → Disable cache** and reload the whole page with the tools open, or compare in a fresh private browser session. Do not clear all site data or credentials as a first step. For repeatable deployment checks, use a unique prerelease version in the isolated preview's metadata, restart that preview server, and reload the page; never modify an already published release tag or archive. The dashboard Refresh button refreshes data, not the plugin runtime.

In Grafana 13.1.1, the [plugin loader](https://github.com/grafana/grafana/blob/v13.1.1/public/app/features/plugins/loader/pluginInfoCache.ts) adds `?_cache=<plugin version>` to filesystem module URLs. Changing files without changing that version reuses the URL; the module hash serves integrity checking, not a separate cache key. A new release version plus a Grafana restart and full-page reload is the durable upgrade path. Do not switch a production server to development mode solely to bypass cache: that mode also changes [unsigned-plugin handling](https://grafana.com/docs/grafana/latest/administration/plugin-management/plugin-sign/).

## Signing and releases

CI builds, tests, packages, and validates metadata. It does not sign or publish this edition. There is no tagged public release workflow. Source and wiki are public; Grafana distribution is private and requires a separately prepared target-scoped release.

For private signing:

```bash
# Supply GRAFANA_ACCESS_POLICY_TOKEN securely; never store it in this repository.
export GRAFANA_PRIVATE_ROOT_URLS="https://grafana.example.com/"
npm run build
npm run sign
```

Follow [Private signing and deployment](PRIVATE_RELEASE.md). Keep source tags and signed release artifacts immutable. This edition is not intended for the public Grafana catalog; that separate edition removes cross-panel DOM capture. Source publication does not establish private signing or deployment approval.

The [reviewer walkthrough](https://github.com/digitalrcs/grafana-intelligence-gateway-private/wiki/Reviewer-Walkthrough) and [live evidence](LIVE_REVIEW_EVIDENCE.md) describe real-provider review; historical evidence is labeled with its version and does not validate the current build.

## Source map

- `src/components/IntelligenceGatewayPanel.tsx`: analysis lifecycle and runtime controls.
- `src/components/ImageInputs.tsx`: in-memory image preview and capture controls; no inference transport.
- `src/vision/`: bounded capture/import utilities, isolated Grafana DOM adapter, and exporter provenance.
- `src/utils/aiClient.ts`: secure data-source transport and response/error handling.
- `src/utils/dataFrames.ts`: bounded serialization of panel query data.
- `src/utils/prompt.ts`: prompt-template construction.
- `src/utils/evidence.ts`: bounded evidence, statistics, baseline comparisons and incident briefs.
- `src/utils/presets.ts`: built-in analysis task instructions.
- `src/components/AssessmentTools.tsx`: evidence details, export and frozen follow-up controls.
- `src/module.ts`: panel option registration.
- `provisioning/dashboards/dashboard.json`: local development dashboard.
- `examples/dashboard.json`: importable configuration example.
- `docs/wiki/`: versioned source for the GitHub Wiki.

See [Contributing](../CONTRIBUTING.md) and [Security](../SECURITY.md).

## Tall-dashboard capture regression

The tall-dashboard test in `tests/vision.spec.ts` uses the isolated `vision-tall.json` test dashboard with eight synthetic charts. It checks every chart cell for rendered green trace pixels, nonzero scroll restoration, gateway exclusion, and no inference request during preview. CI always includes Grafana 12.4.0 and 13.3.0 alongside dynamically resolved versions.

Run with `GRAFANA_VERSION=12.4.0 ANONYMOUS_AUTH_ENABLED=false docker compose up -d --build`, then `npm run e2e -- tests/vision.spec.ts --grep "tall dashboard"`. Use fresh disposable storage when changing Grafana versions; do not downgrade a saved database.
