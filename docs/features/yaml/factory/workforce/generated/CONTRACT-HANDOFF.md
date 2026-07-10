# Contract gen — HANDOFF

Spec: `/home/vutv/workspace/portal/docs/features/yaml/factory/workforce/ir/spec.yaml`

## Entities

- **WorkforceCheckIn** — 6 fields

## Files

- `packages/models/src/workforce/workforce.read.schema.ts`
- `packages/models/src/workforce/workforce.write.schema.ts`
- `packages/models/src/workforce/workforce.types.ts`
- `packages/models/src/workforce/index.ts`

## Manual follow-up

- Confirm `kind: relation` + `persistence.type` when grill infers from columns only.
- Backend scaffold: `fast-gen write` in fast-api-base (see FAST-CODEGEN.md).
