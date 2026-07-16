---
name: grill-test
extractBundle: grill-test
description: /grill-test — refine Playwright E2E on FE (not plan YAML authoring).
disable-model-invocation: true
---

# /grill-test — Playwright audit (FE)

After `/test`. Plan YAML/MD → **base-tests** `/grill-testcase` (do not author plans here).

**Inputs (read):** `base-tests/cases/**/TC-*.yaml` + design `ui.testIds` (base-docs Code) + `tests/e2e/`.

## Traceability

| Check | Pass |
|-------|------|
| Playwright spec | `tests/e2e/{module}/{id}.spec.ts` exists |
| Page Object | used by spec; no raw `getByTestId` in spec files |
| `testIds.required` | used in PO; present on UI |
| Semantic | match `base-docs/platform/toolchain/E2E-SEMANTIC-UI-ASSERTIONS.md` when plan has `assertions.semantic` |

## Verify

```bash
pnpm test:e2e tests/e2e/{module}/
```

## Out of scope

- Editing `base-tests` plans / `cases:render`
- Vitest `/unit` · backend `/api`
