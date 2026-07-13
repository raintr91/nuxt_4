---
name: grill-test
extractBundle: grill-test
description: /grill-test — refine Playwright E2E.
disable-model-invocation: true
---

# /grill-test — E2E coverage audit

After `/test`. **Extracts:** `extractBundle: grill-test` → `.cursor/extracts/extract-registry.json`

**Inputs:** spec + testcase YAML + `tests/e2e/` — no legacy.

## Traceability matrix

For each `docs/features/yaml/.../{function}/*.test.yaml`:

| Check | Pass criteria |
|-------|----------------|
| Spec function | Matching `*-{function}.spec.yaml` exists |
| Playwright spec | `tests/e2e/{module}/{testcase-id}.spec.ts` exists |
| Page Object | `tests/e2e/pages/{module}/*Page.ts` used by spec |
| `requirementIds` | Covered by assertions or documented gap |
| `testIds.required` | Mirrors `spec.ui.testIds.required`; used in PO/spec; all present on UI after gen |
| `testIds.patterns` | Step `testId` matches spec `ui.testIds.patterns` template |

## Scenario coverage (by profile)

**List (`codegen.profile: list`)**

- [ ] Happy path: table/root visible
- [ ] `testIds.required` from testcase
- [ ] Pagination ≥2 pages when spec/mock supports
- [ ] Filter/search only if spec `ui.filters` non-empty
- [ ] Negative assertion (e.g. search form hidden) when testcase says `visible: false`

**Create / edit / detail** (when spec exists)

- [ ] Success path testcase
- [ ] Validation/error visible when testcase requires

**Split actions** (export, login-as, …)

- [ ] Separate testcase file → separate spec (spec-split-by-function)

## Technical checklist

- [ ] Specs do **not** call `getByTestId` directly — only via Page Object
- [ ] No css/xpath/nth-child selectors in `tests/e2e/`
- [ ] `#wire-only` flows: mock network or explicitly skipped pre-wire
- [ ] Semantic assertions match `docs/operational/E2E-SEMANTIC-UI-ASSERTIONS.md` when testcase has `assertions.semantic`

## Verify gate

```bash
pnpm test:e2e tests/e2e/{module}/
# or per-feature scoped path from /test session
```

Must report exit code. No “should pass” without fresh run.

## Lifecycle handoff

When audit passes for a route:

```bash
pnpm portal:lifecycle set {route.path} test
```

After `/wire`, re-run grill-test before `lifecycle set … wire`.

## Out of scope

- Does not replace `/test`
- No backend / `/api` work
- No Vitest (`/unit` is dev-owned; testcase is E2E only)
