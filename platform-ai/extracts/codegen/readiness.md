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

Column `render: custom` → `#needs-component: cell-{key}:MoXxx` in tags.

## Exit checklist

1. Contradictions resolved or `openQuestions` + `#tech-debt:`
2. `codegen` + structured `ui.*` present
3. Testcase testIds mirror spec
4. `portal:gen:dry` pass · `docs:render`

Handoff → `/prototype` only after dry passes.

Templates: `docs/templates/design-spec.yaml` (v1) · `spec.yaml` (post-grill)
