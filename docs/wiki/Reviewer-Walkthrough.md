# Connect and review Intelligence Gateway

Install the panel and Secure AI companion, then follow [Panel setup](Panel-Setup-and-Configuration.md). The starter dashboard has no configured AI connection. Choose your local/hosted backend or Copilot Studio Direct Line agent, configure the secure data source and select a model or alias in the panel.

## Connection

1. In Connections → Data sources, add **Intelligence Gateway Secure AI**.
2. Choose your provider, its server-reachable endpoint, approved model and credentials where required. For Copilot Studio use the Direct Line secret and agent alias; see [Copilot setup](Copilot-Studio-Notes.md).
3. Select Save & test. Then open the panel’s **1. Connect AI** section, select that instance and load or enter the model/agent alias.
4. Confirm the compact connection label names your selected instance and model. A health check verifies access, not answer quality.

## Review the capabilities

Use approved synthetic or non-sensitive evidence with independently checkable facts. Connect query results through Queries → Dashboard → Source panel, or configure this panel’s queries. Ask for observations, uncertainty and next checks. Verify the response against the actual values, then change a value and analyze again.

Test data-only, images-only with query inclusion disabled, and combined requests separately. For images use known PNG/JPEG content or private dashboard/selected-panel capture and a vision-enabled model. Check captured chart content, not only image counts. Previewing does not submit; select Analyze images explicitly. Verify removal, clearing and cancellation. Successful image analysis clears the pending attachment tray and retains the submitted images only in the frozen in-memory snapshot for explicit follow-ups.

Expand Evidence to inspect source, time range and included/omitted rows. Change the query/time range and verify the out-of-date warning. Expand Ask a follow-up and confirm it uses the original data/image snapshot, without recapture or re-query. Expand Share assessment to copy/download a brief; raw query evidence and image bytes are separate opt-ins. Capture metadata remains in the evidence summary. Test two supplied baseline/current query IDs with known values to verify comparisons.

For local reasoning models, align the panel and backend output caps and timeouts. Hidden reasoning can consume the output budget before visible text; raising only the requested visible-answer limit does not raise that budget.

Automated UI contract tests use temporary intercepted responses and cannot establish provider quality. A real model or tenant-specific Copilot channel must be validated separately. Direct Line remains a preview integration, not delegated enterprise SSO. No hosted account or credentials are bundled.
