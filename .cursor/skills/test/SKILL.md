---
name: test
extractBundle: test
description: /test — Playwright E2E from base-tests plan YAML (FE only).
disable-model-invocation: true
---

# /test — Playwright (FE)

**Plans SSOT:** `base-tests` (read-only). **Scripts output:** `tests/e2e/` on this repo.

Author/grill plans → **base-tests** `/testcase` · `/grill-testcase`.  
Hub: `base-docs/platform/toolchain/TESTS-HUB.md` · template: `base-tests/templates/testcase.yaml`

## Gen

```bash
pnpm testcase:gen:dry --id TC-LOGIN-VALID
pnpm testcase:gen --id W-AD-AUTH-001
pnpm testcase:gen --id smoke
```

`--id` resolves via `base-tests/registries/tests-index.json`. Design `ui.testIds` enrich from **base-docs** `refs.screen` → `ir/spec.yaml`.

Do **not** edit SC/TC YAML here — handoff bugs to tests hub.

## Rules

1. `getByTestId()` via Page Object · vertical slice · mock until `/wire`
2. Verify: `pnpm test:e2e tests/e2e/...`

## Handoff

`/grill-test` when suite green.
