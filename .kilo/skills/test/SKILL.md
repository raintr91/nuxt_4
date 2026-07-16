---
name: test
extractBundle: test
description: /test — Playwright E2E from base-tests plan YAML (FE only).
disable-model-invocation: true
---

# /test — Playwright (FE)

**Plans SSOT:** `base-tests` (read-only here). **Output:** `tests/e2e/`.

Author/grill plans → **base-tests** `/testcase` · `/grill-testcase`.  
Hub doc: `base-docs/platform/toolchain/TESTS-HUB.md`

## Gen

```bash
pnpm testcase:gen --id W-AD-AUTH-001
pnpm testcase:gen --id TC-LOGIN-VALID
pnpm testcase:gen --id smoke
```

Do **not** edit SC/TC YAML in this skill — file bugs/handoff to tests hub.

## Rules

1. `getByTestId()` via Page Object · vertical slice · mock until `/wire`
2. Verify: `pnpm test:e2e tests/e2e/...`

## Handoff

`/grill-test` when suite green.
