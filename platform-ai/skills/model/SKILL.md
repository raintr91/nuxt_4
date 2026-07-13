---
name: model
extractBundle: model
description: /model — prefer /contract for Zod gen; manual edge cases only.
disable-model-invocation: true
---

# /model — Portal Models

Prefer **`/contract`** + `pnpm contract:gen` for Zod SSOT in `@portal/models`.

## When to use /model

- Edge-case refinements after `contract:gen`
- `models/common/fields.ts` shared primitives
- Migrating root `models/` imports → `@portal/models`

## Scripts

```bash
pnpm contract:gen:dry --spec .../ir/spec.yaml
pnpm contract:gen --spec .../ir/spec.yaml
```

## Handoff

→ `/api` or `/wire`
