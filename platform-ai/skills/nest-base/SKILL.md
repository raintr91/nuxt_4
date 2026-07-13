---
name: nest-base
extractBundle: nest-base
description: /nest-base — Nest apps/api patterns ported from Laravel api base.
disable-model-invocation: true
---

# Nest API base

Repo: `apps/api/` · Contracts: `@portal/models`

**Docs:** `docs/operational/NEST-API-STRUCTURE.md` · `docs/operational/TEAM-AI-BACKEND-WORKFLOW.md`

## Common layer (port Laravel traits)

| Laravel | Nest |
|---------|------|
| `BaseController` | `common/http/api-response*` |
| `Entry*Trait` | Controller → CQRS bus |
| `BaseAction` | `common/crud/base-write.handler.ts` |
| `BaseQuery` | `common/crud/base-read.query.ts` |
| `BaseResource` | `common/crud/base-resource.ts` |
| `SelectItem*Trait` | `common/crud/select-item.query.ts` |

## Module layout

`apps/api/src/modules/{module}/{entity}/` — flat, no nwidart packages.

## ORM

TypeORM or Prisma per `persistence.orm` in field registry — entities via `nest:gen`, not hand scaffold.

## Rules

- Validation: `ZodValidationPipe` + WriteSchema from `@portal/models`
- Controller thin; Command/Query handlers call common bases
- Cross-domain: `@Injectable()` Service only
