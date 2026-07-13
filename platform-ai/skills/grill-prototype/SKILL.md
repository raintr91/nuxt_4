---
name: grill-prototype
extractBundle: grill-prototype
description: /grill-prototype — gate prototype before wire/test.
disable-model-invocation: true
---

# /grill-prototype — Prototype audit

Use after `/prototype`, before demo, `/test`, or `/wire`.

**Extracts:** `extractBundle: grill-prototype` → `.cursor/extracts/extract-registry.json`

Detail checklist in `.cursor/skills/prototype/SKILL.md`.

## Load policy

| Load | Do not load |
|------|-------------|
| `{function}/ir/spec.yaml` — routes, `ui.testIds`, `api.endpoints` | Legacy source, trace |
| `{function}/*.bundle.yaml` — tags, `grillStatus` | Other functions' bundles |
| Prototype pages — `data-testid` on route | Playwright / Vitest specs |

## Prototype fit

- Happy path, validation messages, loading/empty/error when in spec
- Mock pagination ≥2 pages when list spec applies
- Auth bypass on prototype routes (`PAGE-LIFECYCLE.md`); no real backend calls
- `DataListPage` / registry shell fit; composable mock boundary

## testIds cross-check (`ir/spec.yaml` ↔ UI)

After `/prototype` + `pnpm portal:gen`:

1. Read `docs/features/yaml/.../{function}/ir/spec.yaml` → `ui.testIds.required` and `ui.testIds.patterns`.
2. **Required:** each id must exist as `data-testid` on the prototype route (grep components or inspect DOM).
3. **Patterns:** with mock row data loaded, at least one rendered id matches the template (e.g. `manager-pill-{id}`).
4. Record gap table in handoff (Vietnamese):

| testId / pattern | in ir/spec | on UI | action |
|------------------|------------|-------|--------|
| `{id}` | yes/no | yes/no | fix prototype · `/update-spec` if spec wrong |

5. Block `/test` handoff until all **required** ids pass; document pattern gaps if mock data lacks a row.

**Do not** run full Playwright or Vitest in this command.

## E2E handoff checklist (for `/test`)

Copy into handoff notes (Vietnamese):

1. **Route:** `{path}` · lifecycle stage · auth bypass yes/no
2. **Spec:** `docs/features/yaml/{role}/{domain}/{function}/ir/spec.yaml`
3. **Testcase:** `docs/features/yaml/{role}/{domain}/{function}/*.test.yaml` (E2E only — one per function split)
4. **testIds.required:** cross-check table above — all pass / list gaps
5. **testIds.patterns:** sample id visible when mock has row — ok / missing
6. **Session:** `setup.session` values — helper exists in `tests/e2e/helpers/session.ts` yes/no
7. **Mocks:** `setup.mocks` vs `api.endpoints` in ir/spec — aligned yes/no
8. **#wire-only** tags — list scenarios deferred to `/wire`
9. **Open issues** — blockers for `/test`

## Out of scope

- Legacy code comparison (design lane only if ever needed)
- Writing Playwright specs (`/test`)
- Unit tests (dev-owned; no testcase YAML)

## Handoff targets

- Clear fixes → apply in prototype scope
- Ready for E2E → `/test` (`.cursor/extracts/test/readiness.md`)
- API contract gaps → `/api` in backend repo, then `/wire`
