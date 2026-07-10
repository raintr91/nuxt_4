# Contract gen — HANDOFF

Spec: `/home/vutv/workspace/portal/docs/features/yaml/factory/knowledge-hub/ir/spec.yaml`

## Entities

- **KnowledgeQuery** — 4 fields

## Files

- `packages/models/src/knowledge-hub/knowledge-hub.read.schema.ts`
- `packages/models/src/knowledge-hub/knowledge-hub.write.schema.ts`
- `packages/models/src/knowledge-hub/knowledge-hub.types.ts`
- `packages/models/src/knowledge-hub/index.ts`

## Manual follow-up

- Confirm `kind: relation` + `persistence.type` when grill infers from columns only.
- Backend scaffold: `fast-gen write` in fast-api-base (see FAST-CODEGEN.md).
