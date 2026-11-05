# Grafana Intelligence Gateway — Private

This wiki documents the private internal edition for internal deployments. The internal-edition repository is [https://github.com/digitalrcs/grafana-intelligence-gateway-private](https://github.com/digitalrcs/grafana-intelligence-gateway-private). Current development build: **1.2.0-private.1**, unsigned; private signing and deployment approval remain pending.

The full feature set is retained: query-data analysis, dashboard and selected-panel capture, PNG/JPEG uploads, previews and explicit image submission. Use the Dashboard data source to reuse another panel's results. Captures do not deliberately refresh queries, but lazy panels and scheduled refreshes can still load data. Never infer a universal no-query guarantee from the successful local test.

- [Installation](Installation.md)
- [Panel setup](Panel-Setup-and-Configuration.md)
- [Share panel data](Connecting-Data-from-Other-Panels.md)
- [Image analysis](Image-Analysis.md)
- [AI provider settings](Configuration-AI-Providers.md)
- [LM Studio](LM-Studio-Setup.md)
- [OpenAI](OpenAI-Setup.md)
- [Copilot Studio preview](Copilot-Studio-Notes.md)
- [Prompts and context](Prompt-Engineering-Guide.md)
- [Private Docker demo](Docker-Private.md)
- [Private signing and deployment](Private-Signing-and-Deployment.md)
- [Validation](Validation.md)
- [Security](Security-Considerations.md)
- [Development](Development-and-Contributing.md)

This wiki is versioned under docs/wiki in the public source repository for the internal edition. The public edition has separate source and documentation; do not publish private capture changes there.

## Distribution boundary

This source repository and wiki are publicly readable. Grafana private signing governs installation for the intended internal instances; this edition is not submitted to the public plugin catalog because it retains cross-panel DOM capture. The separate catalog edition omits that functionality.
