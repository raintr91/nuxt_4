# Portal Codegen Tags

Hub: `docs/operational/PORTAL-CODEGEN.md` · registry: `registries/design.registry.json`

## Who adds what

| Phase | Spec |
|-------|------|
| `/legacy-spec`, `/spec` | Design v1 — no `codegen`, gen `tags` |
| `/grill-with-docs` | `codegen`, `ui.*`, `tags` — see `codegen/readiness.md` |
| `/prototype` | `portal:gen` + HANDOFF; implement `#needs-ui` / `#needs-component` |

## Key blocks

`codegen.profile|entity|module|skip` · `ui.filters|columns|composition` · `api.endpoints[].action`

## Hashtags (summary)

| Tag | Use |
|-----|-----|
| `#shell: DataListPage` | List default |
| `#pattern: CRUD` | CRUD flow |
| `#ui:` / `#widget:` | shadcn / form field |
| `#needs-component: {slot}:MoXxx[:prop]` | Prototype implements — portal-gen HANDOFF |
| `#needs-ui:` | Registry planned widget |
| `#common:{id}` | Shared hook/service — `platform-common.registry.json` |
| `#needs-common:{id}` | Planned logic — HANDOFF |
| `#wire-only:` | Defer to `/wire` |
| `#gen:test-*` | Unit gen — see `portal-unit-test-tags.md` |
| `#tech-debt:` | See `grill-tech-debt.md` |
| `#update:*` | `/update-spec` delta — cleared at `/wire` |

List grill default tags if missing: `#shell: DataListPage`, `#pattern: CRUD`, `#style: shadcn/ui`, `compact`, `flat`.

## Commands

```bash
pnpm portal:registry
pnpm portal:gen:dry --spec docs/features/yaml/.../ir/spec.yaml
pnpm portal:gen --spec ...
pnpm portal:unit-gen --spec ...
```

Detail tables: `platform-design-registry.md` · `platform-mark.md` · `portal-unit-test-tags.md` · rule `platform-design-vocabulary.mdc`
