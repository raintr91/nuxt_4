---
name: dev-grill-docs
extractBundle: dev-grill
description: /dev-grill-docs — Dev grill codegen tags + bundle.gen.
disable-model-invocation: true
---

# /dev-grill-docs — Dev / codegen grill

Doc hub: `docs/operational/PORTAL-CODEGEN.md`

**Extracts:** `extractBundle: dev-grill` → `codegen/readiness.md`, `platform-mark-detect.md`

## Load policy

| Load | Do not load |
|------|-------------|
| `ir/design.yaml`, `ir/legacy.yaml` (behaviors, fields) | Legacy source, `models/` |
| `bundle.spec` (api, entities, ui.routes) | Full trace module |
| `codegen/*`, `legacy/legacy-api-migration.md`, `platform-mark-detect.md` | UX copy debates |

## Workflow

1. Expect `grillStatus.bqaOpen: done` (or `bqaFacts` for requirement-only).
2. Derive from design + legacy behaviors → write **`bundle.gen`** (or patch `ir/spec.yaml` then `pnpm spec:merge`):
   - `codegen`, `tags`, `ui.filters`, `ui.columns`, `ui.composition`, `ui.testIds`
   - `api.endpoints[].action`
3. Giữ `#needs-component`, `#manual-composable`, `#skip-codegen`, `#wire-only`, `#phase-api`.
4. List: `#gen:test-schema`, `#gen:test-service` · Create: `#gen:test-validation`
5. **Common candidates** — scan columns, toolbar, filters, composables (**local MCP, not cloud**):
   - Prefer `artifactgraph_grill_check` / `analyze` on `ir/spec.yaml` when MCP wired
   - Mỗi `render: custom` → `#needs-component: cell-{key}:MoXxx` **hoặc** Mo* trong design registry
   - Widget lạ → `lookupAlias()` → `#ui:` / `#needs-ui:`
   - Logic lặp (export, auth) → hỏi member `#common:` / `#needs-common:` (`platform-mark-detect.md`)
   - In bảng **Common candidates** (Vietnamese) — member chọn A/B/C **trong chat local**; `artifactgraph_remember` khi chọn B
   - **Không** gửi câu hỏi A/B/C lên cloud model
6. Optional `marks[]` on spec for confirmed B choices
7. Set `grillStatus.dev: done`.
8. **Gate:** `artifactgraph_gen` `genDry` khi có MCP — else `pnpm portal:gen:dry --spec docs/features/yaml/.../ir/spec.yaml` exit 0.
9. `pnpm spec:split` if edited bundle; user runs `pnpm docs:render`.

## Artifactgraph

See `.cursor/extracts/artifactgraph-phase-hooks.md` · `/artifactgraph`.

## Out of scope

UX prose, acceptance rewrite, implement UI, full E2E.

## Handoff

- Dry pass → `/prototype`
- BQA↔Dev conflict → `/grill-with-docs`
- Legacy fact gap → `/update-spec-legacy`
- Member chose promote common → `/platform-mark` same session or before `/prototype`
