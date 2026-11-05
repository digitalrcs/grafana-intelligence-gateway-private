# Private Docker demo

The maintained local stack is `C:\Data\GrafanaAIPlugin\digitalrcs-demo-grafana`, on localhost:3001. It is outside this panel repository and uses sibling plugin builds. It is not a self-contained internal deployment bundle.

Run `./Start-Demo.ps1` there for normal startup. Use `-RebuildPanel` after changing this panel, or `-Rebuild` to rebuild all companion plugins. Startup verifies the private edition marker and packaged panel version. Preserve the named volume and customized dashboards; never reset volumes for a routine update.

The image is digitalrcs/demo-grafana:13.3.0-private, with Grafana 13.3.0 and private panel 1.2.0-private.1. The shared stack uses actual LM Studio, with no mock fallback. Image analysis was explicitly enabled for the current local model. Endpoints and model choices must be configured for the intended environment; do not copy lab exceptions into production.

The repository's separate localhost:3004 Compose fixture uses a deterministic mock for automated CI. It is not the live shared demo. Avoid running extra persistent local Grafana instances; CI creates and removes its own test instance.

See [validation](PRIVATE_VALIDATION.md) and [private signing](PRIVATE_RELEASE.md).
