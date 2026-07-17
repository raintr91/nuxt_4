# Portal Codegen Readiness

Hub: `PORTAL-CODEGEN.md` · **Who adds:** `/grill-with-docs` only.

Gate: `pnpm portal:gen:dry --spec .../ir/spec.yaml` exit 0.

## Enrich design v1 → gen-ready

| Target | Source |
|--------|--------|
| `codegen.profile` | `*-list`→list, `*-create`→create, `*-edit`→edit |
| `codegen.entity` | segment before suffix (`hotel-list`→`hotel`) |
| `codegen.module` | `entities[].table` or plural entity |
| `ui.composition` | list+table → `DataListPage`; else `custom` + reason |
| `ui.filters|columns` | from `api` query/response + entity fields |
| `ui.testIds` | `module`, `required`, `patterns` for dynamic ids |
| `api.endpoints[].action` | list/create/show/update/delete |
| `tags:` | `codegen/tags.md` + registry hashtags |

List default tags: `#shell: DataListPage`, `#pattern: CRUD`, `#style: shadcn/ui`, `compact`, `flat`.

Column `render: custom` → `#needs-component: cell-{key}:MoXxx` in tags (ask member per `platform-mark-detect.md`).

## Common / component checklist (dev-grill)

Before gate, for each feature:

1. List custom columns → tag or registry Mo*
2. List toolbar/filter widgets not in `#ui:` → `#needs-ui:` or common yaml ref
3. List repeated composable/service patterns → `#common:` / `#needs-common:` + `marks[]`
4. Output **Common candidates** table — member A/B/C
5. Confirmed B → update `tags:` / `marks[]` before `portal:gen:dry`

## Exit checklist

1. Contradictions resolved or `openQuestions` + `#tech-debt:`
2. `codegen` + structured `ui.*` present
3. Testcase testIds mirror spec
4. `portal:gen:dry` pass · `docs:render`

Handoff → `/prototype` only after dry passes.

Templates: `base-docs/templates/design-spec.yaml` (v1) · `spec.yaml` (post-grill)
