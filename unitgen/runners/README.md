# Portal Unit Gen

> **Doc chính:** [Portal codegen (gen + unit)](../../docs/operational/PORTAL-CODEGEN.md) — đọc trước khi quên thứ tự lệnh.

Generate Vitest unit tests from feature `*.spec.yaml` **after** `pnpm portal:gen`.
Separate from `portal-gen` and from `registries/design.registry.json`.

## Usage

```bash
pnpm portal:unit-registry
pnpm portal:unit-gen --spec docs/features/chain/hotel/chain-hotel-list.spec.yaml
pnpm portal:unit-gen:dry --spec docs/features/.../feature.spec.yaml
pnpm portal:unit-gen --spec ... --force
pnpm portal:unit-gen --spec ... --write-spec-tags   # opt-in: merge #needs-unit-test:* into spec
```

## Prerequisites

1. `codegen.profile` in spec (portal-gen-ready)
2. `pnpm contract:gen` — `@portal/models` in `packages/models/src/`
3. `pnpm portal:gen` — `docs/features/{slug}/generated/codegen.manifest.json`
4. App files on disk (`src/services/`, `hooks/`, …)

## Registry

**Source:** `registries/unit-test.registry.json`  
**Validate:** `pnpm portal:unit-registry`

Patterns with `status: implemented` are auto-generated when listed in `defaults.phasePrototype` (schema + service list).

**Roadmap:** [PORTAL-UNIT-GEN-ROADMAP](../../docs/operational/PORTAL-UNIT-GEN-ROADMAP.md)

## Output (PR1)

| Pattern | File |
|---------|------|
| `schema.parseListColumns` | `tests/unit/models/{entity}/{entity}.schema.test.ts` |
| `service.searchGet` / `service.searchPost` | `tests/unit/services/{entity}.service.test.ts` |

Common baselines (không gen per feature): `.cursor/extracts/portal-unit-test-common.md`

Meta per feature:

- `docs/features/{slug}/generated/unit.manifest.json`
- `docs/features/{slug}/generated/UNIT-HANDOFF.md`

## Tags

| Tag | Effect |
|-----|--------|
| `#gen:test-schema` | Force schema unit test |
| `#gen:test-service` | Force service unit test (list) |
| `#skip-unit-test: models` | Skip schema test |
| `#needs-unit-test:*` | Written to UNIT-HANDOFF when pattern not ready |

Extract: `.cursor/extracts/portal-unit-test-tags.md`

## Verify

```bash
pnpm exec vitest run tests/unit/models/chain-hotel/chain-hotel.schema.test.ts
```
