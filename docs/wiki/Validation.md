# Private validation

Private build **1.2.0-private.2** passed 120 unit tests and 19 final browser checks on local Grafana 13.3.0, including actual LM Studio data and captured-image assessments with frozen follow-ups. The image follow-up reused the original bytes and no additional data queries occurred in the tested loaded dashboard. Typecheck, lint (deprecation warnings only), production build and high-severity dependency gate passed.

See [the versioned validation report](https://github.com/digitalrcs/grafana-intelligence-gateway-private/blob/main/docs/PRIVATE_VALIDATION.md) for scope, reproduction and historical results. The installed plugin has no mock AI service or fallback; browser-only fixtures are explicitly separate from live inference tests. These observations use synthetic data and are not private signing, Grafana approval, production certification or independent model-quality validation.
