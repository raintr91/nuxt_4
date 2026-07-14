---
name: model
extractBundle: model
description: /model — Zod models and TS types in models/.
disable-model-invocation: true
---

# /model — Portal Models Only

**Extracts:** `extractBundle: model` → `.cursor/extracts/legacy/project-config.md`

## Load policy

| Load | Do not load |
|------|-------------|
| `{function}/ir/spec.yaml` — entities, api | Full legacy archaeology |
| `models/`, `validations/` target files | Trace, bundle.legacy (unless gap) |
| `legacy/project-config.md` — path resolve only if FE↔BE | `legacy-api-migration` full; full repos JSON |

## Scope

Portal `models/` + `validations/` only — contract keys unchanged.

## Handoff

→ `/api` or `/wire` as needed
