# Portal E2E test readiness (post–prototype)

**Who uses:** `/test`, `/grill-test`, handoff from `/grill-prototype`  
**Not used in:** `/unit` (dev-owned; testcase YAML is E2E only)

Prerequisite: `/prototype` done, `pnpm portal:gen:dry` passed in grill, route on disk.

## Inputs (only)

| Source | Purpose |
|--------|---------|
| `docs/features/yaml/.../ir/spec.yaml` | Requirements, routes, `ui.testIds`, acceptance |
| `docs/features/yaml/.../{function}/*.test.yaml` | **E2E source of truth** — steps, assertions, mocks |
| Prototype code | `data-testid`, composables, mocks |

**No legacy** repos or blade in `/test` sessions — only spec, testcase, portal code.

## Gate before `/test`

1. [ ] Spec split by function — `.cursor/extracts/spec/split.md`
2. [ ] Each child function has `docs/features/yaml/.../{function}/*.test.yaml` (one per function split)
3. [ ] `testcase.route.path` matches `spec.ui.routes[0].path`
4. [ ] `spec.ui.testIds.required` (+ `patterns` when dynamic) declared at grill; after `portal:gen`, every id visible on prototype UI (`docs/operational/E2E-TESTIDS.md`)
5. [ ] `setup.session` name exists in `tests/e2e/helpers/session.ts` — or grill tagged `#needs-session-helper` and helper implemented first
6. [ ] `setup.mocks` paths align with `api.endpoints` in spec (prototype / pre-wire)
7. [ ] Semantic bundles: `#e2e:semantic-*` / `#e2e:a11y-*` or `assertions.semantic` — `.cursor/extracts/portal-e2e-semantic-tags.md`
8. [ ] Tags `#wire-only` documented — E2E uses mock until `/wire`

## File layout (convention)

```text
tests/e2e/
  pages/{module}/{Function}Page.ts   # Page Object — getByTestId only
  fixtures/{module}.ts               # optional — route mocks bundle
  helpers/session.ts                 # setup.session registry
  {module}/{function}.spec.ts        # 1 testcase YAML ≈ 1 spec file
```

Naming: `chain-hotel-list.yaml` → `tests/e2e/chain-hotels/chain-hotel-list.spec.ts` + `pages/chain-hotels/ChainHotelListPage.ts` (module from `ui.testIds.module` or spec `codegen.module`).

## E2E modes

| Mode | Lifecycle | Network |
|------|-----------|---------|
| **prototype** | stage ≠ `wire` | Mock per `testcase.setup.mocks` (`page.route` / fixture) |
| **integrated** | stage `wire` | Real API; remove list mocks; keep session helpers |

Same testcase YAML; scenarios with `#wire-only` in spec tags stay mock-only or skipped until wire.

## Vertical slice (`/test` session)

1. Pick **one** testcase file
2. Add missing `testId` on UI if needed
3. Page Object methods for `steps` / `assertions.ui`
4. Minimal `.spec.ts` → `pnpm test:e2e path/to.spec.ts`
5. Green or root cause → next testcase

## Minimum scenarios (by spec profile)

| Profile | E2E scenarios (testcase) |
|---------|---------------------------|
| `list` | smoke table, empty if spec, pagination ≥2 pages when mock supports |
| `create` | success, validation visible |
| `edit` / `detail` | when spec exists |
| actions (export, login-as) | separate testcase per function split |

## After `/grill-test` pass

```bash
pnpm portal:lifecycle set {route.path} test
```

Re-run scoped E2E after `/wire` before `lifecycle set … wire`.

## References

- `docs/templates/testcase.yaml`
- `.cursor/skills/test/SKILL.md`
- `.cursor/skills/grill-test/SKILL.md`
- `docs/operational/E2E-SEMANTIC-UI-ASSERTIONS.md` — `assertions.semantic`
- `docs/operational/E2E-TESTIDS.md` — naming + spec `ui.testIds` contract
