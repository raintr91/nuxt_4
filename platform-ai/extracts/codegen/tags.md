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
| `#needs-component: MoXxx` | Prototype implements |
| `#needs-ui:` | Registry planned |
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

Detail tables: `portal-design-registry.md` · `portal-unit-test-tags.md` · rule `portal-design-vocabulary.mdc`
