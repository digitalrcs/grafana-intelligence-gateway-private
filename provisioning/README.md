# Local starter dashboard

The starter dashboard has no configured AI connection or preselected model. No AI server, hosted account, credentials, canned assessment or fallback is bundled.

1. Build the panel and the separately maintained Secure AI companion, then start Docker Compose and open <http://localhost:3004>.
2. In **Connections → Data sources**, create an **Intelligence Gateway Secure AI** instance with an approved real provider, server-reachable endpoint and model. Store credentials only in the companion's secure fields. Select **Save & test**.
3. Edit the panel's **1. Connect AI** section and select that instance and model/agent alias.
4. Supply measurements through **Queries → Dashboard → Source panel** or the panel's own queries. Alternatively, capture or upload approved PNG/JPEG images and explicitly submit them with **Analyze images**.
5. Choose an analysis task and review the response against independently checkable evidence.

The private edition retains dashboard and selected-panel capture. The query source and the AI connection are separate: selecting an AI provider does not supply measurements. See [setup](../docs/SETUP.md), [image analysis](../docs/IMAGE_ANALYSIS.md) and [Docker guidance](../docs/DOCKER_PRIVATE.md).

Synthetic dashboards and temporary intercepted responses belong to isolated automated tests. They are not an installed AI provider and are not evidence of model reasoning or vision quality. Do not provision test fixtures into a production instance. The shared local demo on port 3001 uses live LM Studio and is managed separately.
