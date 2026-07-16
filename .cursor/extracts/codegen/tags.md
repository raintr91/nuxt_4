# Portal Codegen Tags

Hub: `base-docs/platform/toolchain/PORTAL-CODEGEN.md` · `registries/design.registry.json`

| Phase | Spec |
|-------|------|
| `/spec` `/legacy-spec` | Design v1 — no codegen tags |
| Docs grill | `codegen`, `ui.*`, `tags` |
| `/prototype` | `portal:gen` + HANDOFF cho `#needs-*` |

Blocks: `codegen.*` · `ui.filters|columns|composition` · `api.endpoints[].action`

| Tag | Use |
|-----|-----|
| `#shell: DataListPage` | List default |
| `#pattern: CRUD` | CRUD |
| `#needs-component: {slot}:MoXxx[:prop]` | Gap → AI/Mo* |
| `#needs-ui:` / `#common:*` / `#needs-common:*` | Registry |
| `#wire-only:` | Defer `/wire` |
| `#gen:test-*` | Unit gen |
| `#update:*` | Delta — clear at `/wire` |

```bash
pnpm portal:registry
pnpm portal:gen:dry --id W-AD-AUTH-001
pnpm portal:gen --id W-AD-AUTH-001
```
