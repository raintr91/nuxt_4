# Contract codegen (`contract-gen`)

Zod contract SSOT in `packages/models` — shared by Next FE and Nest.

## Input

`docs/features/yaml/.../{function}/ir/spec.yaml` — `entities[].fields[]` with `kind`, `scopes`, `contract`, `persistence`.

When `entities` is empty, infers scalar/relation fields from `ui.columns` (pilot fallback).

## Commands

```bash
pnpm contract:registry
pnpm contract:gen:dry --spec docs/features/yaml/.../ir/spec.yaml
pnpm contract:gen --spec docs/features/yaml/.../ir/spec.yaml
pnpm contract:gen --spec ... --force
```

## Output

| Path | Purpose |
|------|---------|
| `packages/models/src/{entity}/*.read.schema.ts` | Response / list contract |
| `packages/models/src/{entity}/*.write.schema.ts` | Create/update command payload |
| `packages/models/src/{entity}/*.relationships.meta.ts` | ORM-agnostic relation meta (TypeORM/Prisma via nest:gen) |
| `{function}/generated/contract.manifest.json` | Plan + written paths |

Registry: `registries/contract-field.registry.json`  
Field guide: `docs/operational/CONTRACT-FIELD-REGISTRY.md`

`portal:gen` does **not** emit models — run `contract:gen` first.
