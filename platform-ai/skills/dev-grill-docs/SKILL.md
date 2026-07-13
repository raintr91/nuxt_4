---
name: dev-grill-docs
extractBundle: dev-grill
description: /dev-grill-docs — Dev grill codegen tags + bundle.gen.
disable-model-invocation: true
---

# /dev-grill-docs — Dev / codegen grill

Doc hub: `docs/operational/PORTAL-CODEGEN.md`

**Extracts:** `extractBundle: dev-grill` → `.cursor/extracts/codegen/readiness.md`

## Load policy

| Load | Do not load |
|------|-------------|
| `ir/design.yaml`, `ir/legacy.yaml` (behaviors, fields) | Legacy source, `models/` |
| `bundle.spec` (api, entities, ui.routes) | Full trace module |
| `codegen/*`, `legacy/legacy-api-migration.md` | UX copy debates |

## Workflow

1. Expect `grillStatus.bqaOpen: done` (or `bqaFacts` for requirement-only).
2. Derive from design + legacy behaviors → write **`bundle.gen`** (or patch `ir/spec.yaml` then `pnpm spec:merge`):
   - `codegen`, `tags`, `ui.filters`, `ui.columns`, `ui.composition`, `ui.testIds`
   - `api.endpoints[].action`
3. Giữ `#needs-component`, `#manual-composable`, `#skip-codegen`, `#wire-only`, `#phase-api`.
4. List: `#gen:test-schema`, `#gen:test-service` · Create: `#gen:test-validation`
5. Set `grillStatus.dev: done`.
6. **Gate:** `pnpm portal:gen:dry --spec docs/features/yaml/.../ir/spec.yaml` exit 0.
7. `pnpm spec:split` if edited bundle; user runs `pnpm docs:render`.

## Out of scope

UX prose, acceptance rewrite, implement UI, full E2E.

## Handoff

- Dry pass → `/prototype`
- BQA↔Dev conflict → `/grill-with-docs`
- Legacy fact gap → `/update-spec-legacy`
