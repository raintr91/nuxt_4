---
name: platform-ai
extractBundle: portal-ai-platform
description: /portal-ai-platform — team AI layer (.cursor, workflow).
disable-model-invocation: true
---

# /portal-ai-platform — Team AI layer

## Scope

**In (primary):**

- `.cursor/rules/`, `.cursor/skills/`, `.cursor/extracts/`
- `docs/operational/` — `FEATURE-ARTIFACT-FLOWS.md`, `FEATURE-ARTIFACT-COMMANDS.md`, `PROMPT-TEMPLATES.md`, pipeline diagrams
- Scripts serving AI: `scripts/spec/`, `scripts/docs/render-docs.mjs`, extract-registry validate
- `shared/portal-design.registry.json` when tied to grill/codegen **workflow** (not app UI work)

**Reference / guinea pig (rewrite freely):**

- `docs/features/**` (hotel, chain, common specs, yaml/md pilot)
- `pages/`, `components/`, mocks, E2E — validate flow; delete/replace when blocking AI infra

**Out unless user asks:**

- Production feature implementation, wire API, full E2E for shipping

## Context (do not re-debate)

- App technical base is **done**; current mission = **AI support for team**.
- Feature docs = **chuột bạch** — no backward-compat preservation for old spec paths.
- Legacy external repos = read-once into trace; portal feature yaml is disposable pilot data.

## Workflow priorities

1. Read `docs/operational/FEATURE-ARTIFACT-FLOWS.md` and `.cursor/extracts/artifact-graph.md` for current flow.
2. Changes follow phase order: init (yaml/md layout) → bundle/split → grill validation → scripts glob.
3. One concern per PR: extract bundle **or** artifact path **or** skill — avoid mixed mega-diffs.
4. Update artifact-graph + extract-registry when adding skills/commands.
5. Pilot on `yaml/admin/hotel/list/` — pass dry → **delete** old `hotel-list.spec.yaml` + `generated/`.

## Feature artifact (pointer)

- SSOT: `*.bundle.yaml` → `pnpm spec:split` → `ir/{spec,legacy,design}.yaml`
- Module trace: `_legacy.trace.yaml`
- BA output: `md/` from bundle render
- Codegen: `ir/spec.yaml` only
- Grill = validation + decision — not reconstruct domain from source

Hub: [`FEATURE-ARTIFACT-FLOWS.md`](docs/operational/FEATURE-ARTIFACT-FLOWS.md) · [`FEATURE-ARTIFACT-COMMANDS.md`](docs/operational/FEATURE-ARTIFACT-COMMANDS.md)

## Extract bundles (pointer)

Do not load all extracts every phase. See `.cursor/extracts/artifact-graph.md` + `extract-registry`.

- `legacy-spec`: core + legacy/* + spec/split
- `bqa-grill`: core + grill/validation + common-ui — no legacy source
- `dev-grill`: core + codegen/* + legacy/api-migration
- `unit`: core + test/* only

## Rule layer

- `portal-ai-platform.mdc` — alwaysApply context (this doc expands it)
- `portal-invariants.mdc` — still applies when editing app code
- `team-flow-router.mdc` — command → skill map

## Done

- AI infra change is scoped, documented in flow docs, extracts, or skills
- No unnecessary dual paths (old + new spec layout)
- Skills use `extractBundle` ids when registry exists
- Guinea pig specs updated or removed — not left blocking new layout
