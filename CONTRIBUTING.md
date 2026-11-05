# Contributing

This repository contains the internal Grafana edition, including DOM capture. The repository and wiki are public, but the intended Grafana distribution and signing are private. Keep the no-DOM public-catalog edition in its separate repository. Never include customer dashboards, target-specific deployment details or credentials in issues, code or screenshots.

Edit wiki pages in `docs/wiki/` as well as publishing their corresponding GitHub wiki updates. Follow `docs/PRIVATE_RELEASE.md` for signing; do not add a public catalog release workflow.

Use Node.js 22+ and the npm version declared in `package.json`.

```bash
npm install
npm run typecheck
npm run lint
npm run test:ci
npm run build
```

Run Grafana locally with `docker compose up` and use `npm run e2e` for Playwright coverage. Do not edit `.config/`; it is managed by Grafana Plugin Tools. Add tests for prompt, serialization, provider, and option behavior changes. Never commit credentials or dashboards containing them.
