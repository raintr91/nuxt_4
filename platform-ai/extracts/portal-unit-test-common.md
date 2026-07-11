# Portal unit test — common baselines

Hub: `PORTAL-CODEGEN.md` · registry: `shared/portal-unit-test.registry.json`

## Do not duplicate (portal base already covers)

`apiResponse.test.ts` · `parseApiData.test.ts` · `fetchUtils`/`fetch` plugin · `form/*Logic` · `dataTableLogic` · `useRouteGuard`

## Per-feature gen (list)

| Layer | Path pattern |
|-------|----------------|
| models | `tests/unit/models/{entity}/*.schema.test.ts` |
| service | `tests/unit/services/{entity}.service.test.ts` |
| export | `...service.export.test.ts` when `action: export` |
| composable | `tests/unit/composables/{entity}/use{Entity}List.test.ts` |
| wire | `...service.wire.test.ts` (`--phase wire`) |

Create: `validations/.../schemas.test.ts` · `use{Entity}Form.test.ts` · `service.create.test.ts`

## Mock rules

- Mock `$apiFetch` / service at boundary — not Pinia internals
- Assert `path`, `method`, body/query — not implementation detail
- Legacy store tests → composable + service in portal

Tags: `portal-unit-test-tags.md` · `#gen:test-schema|service|validation`
