# Private signing and deployment

Status: private development version 1.2.0-private.1; no private signed archive or Grafana approval yet. Do not use historical public ZIPs, SHA1 values or Community signatures as evidence for this edition.

1. Agree with Grafana on the signing organization and eligibility for the intended internal deployment. Confirm whether the retained plugin ID can use the requested private signature; do not assume public catalog approval transfers.
2. Record the exact target Grafana `root_url` values, including subpaths. Keep target-specific values and tokens out of source control.
3. Select an immutable source commit and version. Run unit, type, lint, build and supported-Grafana browser checks; verify the actual capture image content. Validate the companion datasource release separately.
4. Provide `GRAFANA_ACCESS_POLICY_TOKEN` with `plugins:write` securely and set `GRAFANA_PRIVATE_ROOT_URLS` to the comma-separated target URLs. Run `npm run build`, then `npm run sign`. The wrapper checks the built name/version and refuses missing URL or token configuration. Do not edit dist after signing.
5. Confirm MANIFEST.txt declares the intended private signature and target URLs. Package the complete signed plugin directory under its plugin ID; record the exact ZIP SHA1/SHA256, source commit, signing scope and validation results. Share artifacts only through the authorized internal channel; do not attach target-scoped signed builds or deployment configuration to this public source repository without explicit release authorization. No automatic release workflow publishes them.
6. Back up the target instance, install the panel and validated companion, restart Grafana and hard-refresh the browser. Verify the loaded version and valid signature on the target root URL without an unsigned-plugin exception for this panel. Test data-only, image-only and combined analysis using approved test data before operational use.

Private signing restricts installation URLs; it is not public catalog certification, model-quality certification or organizational approval. The localhost demo credentials, unsigned allowlist and HTTP lab exception are not production settings.

Official reference: [Grafana signing documentation](https://grafana.com/developers/plugin-tools/publish-a-plugin/sign-a-plugin).

The GitHub source repository and wiki are public. This does not change the intended private Grafana distribution. Private signing is still pending; no catalog approval is implied.
