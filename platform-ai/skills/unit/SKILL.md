---
name: unit
extractBundle: unit
description: /unit — Vitest unit tests via portal:unit-gen.
disable-model-invocation: true
---

# /unit — Portal Vitest (dev lane)

Diagram: `docs/operational/UNIT-PHASE-DIAGRAM.md`  
Hub: `docs/operational/PORTAL-CODEGEN.md`

**Extracts:** `extractBundle: unit` → `.cursor/extracts/portal-unit-workflow.md`

## Load policy

| Load | Do not load |
|------|-------------|
| `{function}/generated/unit.manifest.json` | `legacy/*`, E2E testcase YAML |
| `{function}/generated/UNIT-HANDOFF.md` | Full `tests/unit/` inventory |
| `{function}/ir/spec.yaml` — codegen, reqIds filter | `codegen/readiness` full doc |
| Source files listed in manifest gap | `pages/`, `components/` |

## Workflow

1. `pnpm portal:unit-gen --spec docs/features/yaml/.../ir/spec.yaml`
2. Clear `needsUnit[]` per manifest.
3. `pnpm exec vitest run <paths from manifest.written>`

**Do not read:** legacy-api-migration, design registry full scan.

## Handoff

→ `/grill-unit`
