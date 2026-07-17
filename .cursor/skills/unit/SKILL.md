---
name: unit
extractBundle: unit
description: /unit — Vitest unit tests via portal:unit-gen.
disable-model-invocation: true
---

# /unit — Portal Vitest (dev lane)

Diagram: `base-docs/platform/toolchain/UNIT-PHASE-DIAGRAM.md`  
Hub: `base-docs/platform/toolchain/PORTAL-CODEGEN.md`

**Extracts:** `extractBundle: unit`

## Load policy

| Load | Do not load |
|------|-------------|
| `base-docs/…/code/{W-…}/generated/unit.manifest.json` | E2E plan YAML (`base-tests`) |
| `…/generated/UNIT-HANDOFF.md` | Full `tests/unit/` inventory |
| Hub `ir/spec.yaml` — codegen, reqIds | Full design registry dump |

## Workflow

0. MCP `analyze` / `gaps` on hub `ir/spec.yaml`; `unitGen` / `unitGenDry` khi wired.
1. `pnpm portal:unit-gen --id W-AD-AUTH-001` (cần `portal:gen --id` trước — manifest trên hub Code).
2. Clear `needsUnit[]` per manifest.
3. `pnpm exec vitest run <paths from manifest.written>`
4. Pattern mới → promote `registries/unit-test.registry.json` + MCP `remember`.

## Handoff

→ `/grill-unit`
