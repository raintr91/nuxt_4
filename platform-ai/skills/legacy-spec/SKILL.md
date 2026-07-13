---
name: legacy-spec
extractBundle: legacy-spec
description: /legacy-spec — legacy trace + bundle YAML.
disable-model-invocation: true
---

# /legacy-spec — Legacy IR (archaeology 1 lần / module)

**Extracts:** `extractBundle: legacy-spec` → `.cursor/extracts/extract-registry.json`

Hub: `docs/templates/legacy-trace.yaml`, `docs/templates/feature.bundle.yaml`, `docs/templates/bundle-authoring.md`

## Load policy

| Load | Do not load |
|------|-------------|
| Legacy source (minimal inventory) | `codegen/*`, `test/*`, prototype rules |
| Write `_legacy.trace.yaml` + `*.bundle.yaml` | `ir/spec.yaml`, `bundle.gen` |
| `legacy/evidence.md` — pointer only | Full repo scan, 200-line snippets |

## Workflow

1. Compact inventory: routes → controller → service → view (per function).
2. Write/update `docs/features/yaml/{role}/{domain}/_legacy.trace.yaml` (`portal-legacy-trace/v1`).
   - `index`: functionId → slice, legacyRoute, controller
   - `slices`: route, server, queryParams, permissions, rules, ui (pointer)
   - `refs`: `legacy://` URI map — file + symbol, no prose dump
3. Per child function: `yaml/.../{function}/{id}.bundle.yaml`
   - `specOrigin: legacy`
   - `spec`: design v1 — actors, entities, requirements, `ui.routes`, `api`, `acceptance`
   - `legacy`: behaviors[], fields[], ui[], evidence[], `legacyRef` → trace slice
   - `design`: rough zones/shell (optional stub)
   - `review.layoutNotes`: short BA prose if needed
4. **Không** `gen`, `codegen`, `tags`, `ui.filters/columns`, canonical registry tags.
5. `{id}.test.yaml` round 1 + `pnpm spec:split` + `pnpm docs:render`.
6. `pnpm legacy-trace:validate -- .../_legacy.trace.yaml`

## Evidence rules

- Trust executable code over comments.
- Preserve legacy field/API names.
- **Không** `notes.inferredFromCode` prose — dùng `legacy.behaviors[]` + trace slice.
- Gaps → `openQuestions`.

## Handoff

→ `/bqa-grill-docs` (default). **Không** nhảy `/grill-with-docs`.
