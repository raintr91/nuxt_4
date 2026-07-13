---
name: api
extractBundle: api
description: /api — Nest backend router in apps/api (in-repo).
disable-model-invocation: true
---

# /api — Backend API (in-repo)

**Extracts:** `extractBundle: api`

## Scope

`apps/api/` + `packages/models/` — not Nuxt `pages/` unless asked.

## Router

| State | Command |
|-------|---------|
| Missing Zod contracts | `/contract` → `pnpm contract:gen` |
| No `backend/01-backend-spec.yaml` | `/api-spec` |
| Portal delta | `/api-update-spec` |
| Not codegen-ready | `/grill-api-spec` |
| Approved | `/api-code` → `pnpm nest:gen` |

Skills (port from `~/workspace/api/.cursor/skills/`): `api-spec`, `grill-api-spec`, `api-code`, `api-update-spec` — paths in-repo.

Patterns: `/nest-base` · `docs/operational/TEAM-AI-BACKEND-WORKFLOW.md`

## Handoff

→ `/grill-api` → `/wire`

Legacy Laravel `~/workspace/api` — read-only for pattern port, not default runtime.
