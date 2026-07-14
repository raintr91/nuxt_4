---
name: grill-with-docs
extractBundle: grill-with-docs
description: /grill-with-docs — reconcile BQA↔Dev + portal:gen dry.
disable-model-invocation: true
---

# /grill-with-docs — Reconcile + codegen gate

**Mindset:** Spec Validation + Decision Resolution — **not** Interview / archaeology.

Doc hub: `docs/operational/PORTAL-CODEGEN.md`

**Extracts:** `extractBundle: grill-with-docs` → `.cursor/extracts/grill/validation.md`

## Load policy

| Load | Do not load |
|------|-------------|
| `*.bundle.yaml`, `ir/design.yaml`, `ir/legacy.yaml` | Legacy repo source, `models/` |
| `ir/spec.yaml` or `bundle.gen` (reconcile codegen) | Full module trace |
| `*.test.yaml`, testcase YAML | `platform-repos` / `legacy-repos` full read |
| `codegen/readiness.md`, `codegen/tags.md` | |

## When to use

- After `/bqa-grill-docs` + `/dev-grill-docs` when **contradiction** remains
- **Not** default after `/legacy-spec`

## Workflow

0. Tech debt step 0 (`grill-tech-debt.md`).
1. Resolve spec ↔ legacyEvidence ↔ design conflicts in **bundle**.
2. Write/fix `bundle.gen` → `pnpm spec:split`.
3. **Gate:** `artifactgraph_gen` `genDry` khi MCP wired — else `pnpm portal:gen:dry --spec .../ir/spec.yaml` exit 0.
4. `pnpm docs:render`.

## Artifactgraph

Local reconcile + dry gen; **không** cloud cho confirm block. Conflicts dài hiếm → `cloudPromptSlice`.

## Do not

- Re-read legacy source or archaeology
- Implement UI/API

## Handoff

→ `/prototype` when dry passes
