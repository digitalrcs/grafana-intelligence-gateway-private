# Private Docker demo

The maintained local stack is `C:\Data\GrafanaAIPlugin\digitalrcs-demo-grafana`, on localhost:3001. It is outside this panel repository and uses sibling plugin builds. It is not a self-contained internal deployment bundle.

Run `./Start-Demo.ps1` there for normal startup. Use `-RebuildPanel` after changing this panel, or `-Rebuild` to rebuild all companion plugins. Startup verifies the private edition marker and packaged panel version. Preserve the named volume and customized dashboards; never reset volumes for a routine update.

The November 5 feature validation used image digitalrcs/demo-grafana:13.3.0-private, Grafana 13.3.0 and private panel 1.2.0-private.2. The running module matched the local production build; 119 unit tests and 19 browser checks passed. The shared stack uses actual LM Studio, with no mock fallback. Image analysis was explicitly enabled for the current local model. Endpoints and model choices must be configured for the intended environment; do not copy lab exceptions into production.

The repository's separate localhost:3004 Compose environment supplies an unconfigured starter dashboard. Select a real Secure AI connection and model before analysis; no AI server or canned-response provider is bundled. Automated browser tests install isolated synthetic fixtures and intercept requests only inside the test harness. Those responses do not establish inference quality. Avoid running extra persistent local Grafana instances; CI creates and removes its own test instance.

See [validation](PRIVATE_VALIDATION.md) and [private signing](PRIVATE_RELEASE.md).
