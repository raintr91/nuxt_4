---
name: api-code
extractBundle: api-code
description: /api-code — nest:gen after approved backend spec.
disable-model-invocation: true
---

# /api-code

Requires `approval.status: approved` on `backend/01-backend-spec.yaml`.

## Script-first

```bash
pnpm nest:gen --spec docs/features/yaml/.../backend/01-backend-spec.yaml --write-spec
pnpm nest:unit-gen --spec .../backend/01-backend-spec.yaml
```

Read `generated/codegen.manifest.json` + `HANDOFF.md` — implement only TODO/manual items (repository wiring, relation sync).

Patterns: `/nest-base` · `apps/api/src/common/`

Verify: `pnpm --filter @portal/api test`
