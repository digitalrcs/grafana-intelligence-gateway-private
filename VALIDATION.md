# Edition split verification — 2026-11-05

Version: 1.2.0-private.1; local development candidate, not signed or published.

- TypeScript checks passed.
- ESLint: no errors; 11 existing API-deprecation warnings.
- Unit tests: 96 passed.
- Production webpack build passed. Built plugin.json version verified.
- Existing plugin ID retained. One edition per Grafana instance.
- No remote pushes, commits, tags or catalog submissions performed. The private build was deployed to the existing localhost Docker demo.

Docker was started and Grafana 13.3.0 confirmed private panel 1.2.0-private.1. Live LM Studio text and image requests and exporter PNG download passed. A visual check found intermittent blank dashboard content; a bounded 400 ms quiet interval followed by paint frames was added before capture, with cancellation and mutation regression tests. See ../local-updates/private-docker-20261105/ for browser evidence and repeat results. These checks use synthetic demo data; they are not production approval.

Full capture and image controls are retained from commit 54eea10b15167d6917203295979fc9ba63b6f0ba, with the new render-settling wait. Public release workflow removed; origin push disabled. Private signing correctly refused missing URL/credential configuration; no signing request was sent. The current dist is an unsigned private development build; historical signed releases remain in release evidence.
