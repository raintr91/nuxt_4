# Portal unit test tags

> **Doc chính:** [`docs/operational/PORTAL-CODEGEN.md`](../../docs/operational/PORTAL-CODEGEN.md) — tổng hợp `portal:gen` + `portal:unit-gen`.  
> **Diagram:** [`docs/operational/UNIT-PHASE-DIAGRAM.md`](../../docs/operational/UNIT-PHASE-DIAGRAM.md) — unit lane + `#needs-unit-test` lifecycle (2 diagram).

Source: `pnpm portal:unit-gen --spec docs/features/.../*.spec.yaml`  
Registry: `shared/portal-unit-test.registry.json` — validate `pnpm portal:unit-registry`  
Manifest: `docs/features/{slug}/generated/unit.manifest.json`

**Separate** from UI `portal-design.registry.json` and from `codegen.manifest.json`.

## Who adds what

| Phase | Adds to spec |
|-------|----------------|
| `/grill-with-docs` | List profile default: `#gen:test-schema`, `#gen:test-service` (khi chưa có tag unit). Create: `#gen:test-validation` |
| `portal:unit-gen` | `unit.manifest.json`, `UNIT-HANDOFF.md`, `#needs-unit-test:*` for planned patterns |
| `/unit` | Implement gaps; promote registry — `UNIT-REGISTRY-PROMOTION.md` |

## Dev lane (`/unit` → `/grill-unit`)

Chi tiết diagram: [UNIT-PHASE-DIAGRAM](../../docs/operational/UNIT-PHASE-DIAGRAM.md) · extract: `portal-unit-workflow.md`

| Lệnh | Việc |
|------|------|
| `/unit` | `needsUnit`, `portal:unit-gen`, tách file thiếu, vitest green |
| `/grill-unit` | Coverage scoped + `reqIds` — sau `/unit` |

## Hashtags (`tags:`)

| Tag | Generator behavior |
|-----|-------------------|
| `#gen:test-schema` | Force `tests/unit/models/{entity}/{entity}.schema.test.ts` |
| `#gen:test-service` | Force `tests/unit/services/{entity}.service.test.ts` (list) |
| `#skip-unit-test: models` | Skip schema unit test |
| `#skip-unit-test: schema` | Same as models layer |
| `#needs-unit-test: {layer}:{target}` | Not auto-gen yet — see UNIT-HANDOFF |
| `#test-mock:api-fetch` | Service tests use `tests/unit/_helpers/mockApiFetch.ts` (PR2+) |

## Commands

```bash
pnpm portal:unit-registry
pnpm portal:unit-gen:dry --spec docs/features/chain/hotel/chain-hotel-list.spec.yaml
pnpm portal:unit-gen --spec docs/features/chain/hotel/chain-hotel-list.spec.yaml
pnpm portal:unit-gen --spec ... --write-spec-tags   # opt-in: merge #needs-unit-test:* into spec tags
pnpm exec vitest run tests/unit/models/chain-hotel/chain-hotel.schema.test.ts
```

## After generate

1. Read `{feature-dir}/generated/UNIT-HANDOFF.md`
2. Run scoped vitest
3. `/unit` only for `needsUnit[]` in manifest
4. Promote pattern in registry — `docs/operational/UNIT-REGISTRY-PROMOTION.md`
