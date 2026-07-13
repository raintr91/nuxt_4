---
name: contract
extractBundle: contract
description: /contract — Zod SSOT in packages/models via contract:gen.
disable-model-invocation: true
---

# /contract — Shared Zod contracts

Hub: `docs/operational/CONTRACT-FIELD-REGISTRY.md`

## Input

`docs/features/yaml/.../{function}/ir/spec.yaml` — `entities[].fields[]` with `kind`, `scopes`, `contract`, `persistence`.

## Scripts

```bash
pnpm contract:gen:dry --spec .../ir/spec.yaml
pnpm contract:gen --spec .../ir/spec.yaml
```

## Scope

- Write `@portal/models` only — not Nest modules, not Nuxt pages.
- Enrich missing `entities.fields` in spec (dev-grill) before gate.
- HANDOFF only for ambiguous relations (`openQuestions`).

## Handoff

→ `portal:gen` (FE) · `nest:gen` (API) · `/wire`
