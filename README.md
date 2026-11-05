# Grafana Intelligence Gateway — Private

Private internal edition maintained by DigitalRCS for internal deployments. Public source availability, Grafana private signing and organizational deployment approval are separate matters. The source repository is public. This edition is not distributed through the Grafana public plugin catalog; it retains cross-panel DOM capture for internal deployment with private signing.

Current development version: **1.2.0-private.2**. The running local Docker build is unsigned; no private release has been signed or approved yet.

## Features

- Analyze Grafana query results with administrator-approved local or hosted AI.
- Reuse an existing panel's results through **Queries → Dashboard → Source panel** in the same dashboard.
- Capture the rendered dashboard or selected panels, upload PNG/JPEG files, review previews and explicitly select **Analyze images**.
- Combine query rows with images, or turn off **Include query data with images** for image-only analysis.
- Review evidence summaries with source, time range, included/omitted rows and an out-of-date indicator.
- Choose spike, series-comparison, handover or data-quality presets; calculate sample statistics with explicit gauge/counter semantics.
- Compare two supplied current/baseline query results without automatically fetching historical data.
- Ask follow-up questions against a frozen data/image snapshot and copy or download a Markdown incident brief. Raw query data and image bytes are separate opt-ins.
- Configure prompts, skills/context, model selection, request limits, clear/refresh controls and optional automatic text analysis.

Capture is retained only in this private edition. It does not deliberately refresh data; scrolling can trigger initial lazy-panel loads and scheduled refreshes can still occur. The tested loaded dashboard made no additional data queries during capture. Preview is not inference; images are sent only on the explicit analysis action. PNG/JPEG uploads are supported; PDF and office documents are not.

## Setup

Requires Grafana 11.6 or later and the separate [Intelligence Gateway Secure AI datasource](https://github.com/digitalrcs/grafana-intelligence-gateway-datasource), with an image-capable version and administrator-approved vision model for image requests. The 1.1.0 companion is the minimum image contract; choose and validate a maintained security release for deployment. Provider credentials stay in the companion's encrypted Grafana configuration, not panel options.

The local shared demo runs at [localhost:3001](http://localhost:3001/d/digitalrcs-demo-showcase/digitalrcs-demo-showcase) using live LM Studio and synthetic data. From `C:\Data\GrafanaAIPlugin\digitalrcs-demo-grafana`, run `./Start-Demo.ps1`, or `./Start-Demo.ps1 -RebuildPanel` after panel changes. The local demo allows unsigned builds and is not production configuration. See [Docker setup](docs/DOCKER_PRIVATE.md).

For a standalone checkout, `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:ci`, and `npm run build` validate and build the panel. Automated browser tests use isolated test fixtures and temporary intercepted responses; they do not establish AI quality. The installed plugin and starter dashboard require a configured real AI provider and have no bundled mock server or fallback. See [development](docs/DEVELOPMENT.md).

No model or AI connection is preselected for new panels. Configure the companion and choose an approved model under **1. Connect AI** before analysis. Existing saved real-provider selections remain usable.

## Documentation

- [Internal-edition wiki](https://github.com/digitalrcs/grafana-intelligence-gateway-private/wiki) and [versioned wiki source](docs/wiki/Home.md)
- [Panel setup](https://github.com/digitalrcs/grafana-intelligence-gateway-private/wiki/Panel-Setup-and-Configuration)
- [Analysis workflow, evidence and follow-ups](docs/SETUP.md)
- [Share existing panel data](docs/CONNECTING_DATA.md)
- [Image analysis](docs/IMAGE_ANALYSIS.md)
- [Private signing and deployment](docs/PRIVATE_RELEASE.md)
- [Validation and limitations](docs/PRIVATE_VALIDATION.md)
- [Report an internal issue](https://github.com/digitalrcs/grafana-intelligence-gateway-private/issues)

Both editions preserve `digitalrcs-intelligencegateway-panel` for dashboard compatibility. Install one edition per Grafana instance, replace the full plugin directory when switching, and restart Grafana. This private checkout must push only to `https://github.com/digitalrcs/grafana-intelligence-gateway-private`; public-edition work belongs in the separate public workspace.

The code retains its Apache-2.0 license and inherited attribution. Historical public release notes are retained as historical evidence; they do not certify the private edition.
