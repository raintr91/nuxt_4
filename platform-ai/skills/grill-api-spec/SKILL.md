---
name: grill-api-spec
extractBundle: grill-api-spec
description: /grill-api-spec — audit backend spec + nest:gen:dry gate.
disable-model-invocation: true
---

# /grill-api-spec

After `/api-spec`, before `/api-code`.

## Gates

```bash
pnpm contract:gen:dry --spec .../ir/spec.yaml
pnpm openapi:gen:dry --spec .../backend/01-backend-spec.yaml
pnpm nest:gen:dry --spec .../backend/01-backend-spec.yaml --write-spec
```

Enrich `codegen`, `#gen:*`, `approval` on backend spec. No hand scaffold.

Handoff → `/api-code` when `approval.status: approved`.
