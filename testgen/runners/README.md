# Testcase Gen (PR12)

Generate Playwright Page Object + spec skeleton from `testcases/*.yaml`.

Separate from `portal:unit-gen` and `portal:gen`.

## Usage

```bash
pnpm testcase:gen:dry --testcase docs/features/chain/hotel/testcases/chain-hotel-list.yaml
pnpm testcase:gen --testcase docs/features/chain/hotel/testcases/chain-hotel-list.yaml
pnpm testcase:gen --feature chain/hotel
pnpm testcase:gen --feature chain/hotel --force
```

## Output

| Input | Output |
|-------|--------|
| `testcase.id` | `tests/e2e/{module}/{id}.spec.ts` |
| `spec.ui.testIds.module` | `tests/e2e/pages/{module}/{PageClass}.ts` |

## Steps supported

| Action | YAML | Generated |
|--------|------|-----------|
| `goto` | `path` | `po.goto` |
| `waitFor` | `testId` | `po.waitForTestId` |
| `waitFor` | `role` + `name` (`/regex/`) | `po.waitForRole` |
| `fill` | `testId`, `value` | `po.fill` + placeholders |
| `click` | `testId` | `po.click` / `resolveTestIdTemplate` |
| `assertions.network` | method, path, body | `whenNetworkRequest` + `assertRequestMatches` |
| `assertions.ui` | `newTabOpened` | `expectNewTabWithUrl` |

## Semantic UI + axe (PR13a)

Registry: `registries/e2e-test.registry.json` · `pnpm portal:e2e-registry`

| Tag | Effect |
|-----|--------|
| `#e2e:semantic-smoke` | Level 1 matchers (console, scroll, images) |
| `#e2e:semantic-list` | List layout smoke + table/overlap |
| `#e2e:a11y-wcag` | Axe WCAG scan scoped to `rootTestId` |
| `#skip-e2e-assert:{matcher}` | Remove one matcher from union |

Union with `assertions.semantic.level1|layout|accessibility` in testcase YAML.  
Extract: `.cursor/extracts/portal-e2e-semantic-tags.md`

## Prerequisites

- `setup.session` registered in `tests/e2e/helpers/applyTestcaseMocks.ts`
- `setup.mocks[].response` registered in fixture registry (`tests/e2e/fixtures/`)
- E2E API: set `NEXT_PUBLIC_API_URL` or mock routes in Playwright helpers

Hub: `docs/operational/TEST-PHASE-DIAGRAM.md` · `PORTAL-UNIT-GEN-ROADMAP.md` PR12–13
