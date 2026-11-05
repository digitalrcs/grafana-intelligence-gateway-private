# Install the private edition

Install the separately validated secure AI datasource before this panel. Both editions use the same plugin ID, so install only one edition per Grafana instance. Replace the complete plugin directory when switching editions, restart Grafana and refresh the browser.

No signed private archive exists yet. Follow [Private signing and deployment](Private-Signing-and-Deployment.md); do not install an older public release ZIP expecting private version 1.2.0-private.1. A private checkout does not automatically provide a private signature.

For local development, see [Docker](Docker-Private.md). For a new source checkout run npm ci and npm run build. Do not enable unsigned loading in the target production instance as a replacement for signing.

The metadata minimum is Grafana 11.6.0; check [actual validation](Validation.md) for tested versions and limitations.
