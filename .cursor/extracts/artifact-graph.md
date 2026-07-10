# Artifact graph — load per phase

Extract bundles: `.cursor/extracts/extract-registry.json`

Path root: `docs/features/yaml/{role}/{domain}/{function}/`

| Phase | Primary artifacts | Do not load |
|-------|-------------------|-------------|
| legacy-spec | write `../_legacy.trace.yaml`, `*.bundle.yaml` (legacy section) | gen, ir/spec, codegen/* |
| /spec | `*.bundle.yaml` (spec + design), template | legacy/* |
| bqa-grill | `ir/design.yaml`, `ir/legacy.yaml` ui slice, common bundles, `review` | ir/spec gen fields, legacy source |
| dev-grill | `ir/design`, `ir/legacy`, write `gen` / ir/spec | legacy source, models/ |
| grill-with-docs | bundle + ir/* reconcile | legacy source, archaeology |
| portal:gen | **`ir/spec.yaml`** | bundle, legacy, design, models (use contract:gen) |
| contract:gen | **`ir/spec.yaml`** entities.fields | legacy source |
| /fast-spec | **`backend/01-backend-spec.yaml`** (author in **fast-api-base** `docs/features/`) | FE pages |
| /grill-fast-spec | fast repo `backend/01-backend-spec.yaml` + registry | legacy source |
| fast:gen (`/fast-code`) | fast repo `backend/01-backend-spec.yaml` | FE pages |
| fast:unit-gen | fast repo backend spec + registry | portal vitest |
| line:gen | **line repo** `ir/spec.yaml` `clients.line` | integration specs |
| integration:gen | **integration repo** `integration/01-integration-spec.yaml` | line screens |
| /line-spec | **line repo** `clients.line` | portal backend |
| /line-prototype | line-gen + mock lane | FE pages |
| /line-wire | line services → fast | legacy |
| /integration-spec | `01-integration-spec.yaml` | FE |
| /integration-code | integration-gen write | portal pages |
| /wire | `ir/spec.yaml` + portal `services/` | legacy-api-migration |
| docs:render | **`*.bundle.yaml`** | — |
| prototype | **`ir/spec.yaml`** + HANDOFF | legacy IR |
| /test | `*.test.yaml`, ir/spec testIds | legacy-api-migration |
| /unit | ir/spec + `{function}/generated/unit.manifest.json` | legacy/* |
| /model | ir/spec entities + project-config | trace full |
| /grill-api | legacy/api-migration (Laravel read-only) | models/ |
| update-spec-legacy | trace slice + bundle.legacy patch | macro legacy read |

**Backend repo:** `~/workspace/fast-api-base` — resolve via root `team-projects.json` group `factory-ai-stack` ([PROJECT-MAPS](../../docs/operational/PROJECT-MAPS.md)).

Generated output:
- Portal: `{function}/generated/` (HANDOFF, manifests) — cạnh bundle, không trong `ir/`.
- Fast: `src/app/modules/...` — trong fast-api-base.
- Line: `src/Line.App/Generated/` — trong `~/workspace/line`.
- Integration: `src/Integration.*/Generated/` — trong `~/workspace/integration`.
