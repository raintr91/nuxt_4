---
name: test
extractBundle: test
description: /test — Playwright E2E from testcase YAML.
disable-model-invocation: true
---

# /test — Portal E2E

**Extracts:** `extractBundle: test` → `.cursor/extracts/test/readiness.md`

## Load policy

| Load | Do not load |
|------|-------------|
| `{function}/*.test.yaml`, `yaml/.../**/*.test.yaml` | Legacy source, trace |
| `{function}/ir/spec.yaml` — `ui.testIds`, routes | `legacy/*`, full bundle |
| Prototype pages + `data-testid` | `legacy-api-migration` |

## Prerequisites

`/prototype` complete · readiness gate in extract bundle `test`.

## Rules

1. Testcase YAML = E2E source of truth (one file per child function).
2. Playwright + Page Object + `getByTestId()` only.
3. Vertical slice: one testcase → green → next.
4. Mock per testcase until `/wire`.

Verify: `pnpm test:e2e tests/e2e/{module}/{function}.spec.ts`

## Handoff

→ `/grill-test` · `pnpm portal:lifecycle set {route} test`
