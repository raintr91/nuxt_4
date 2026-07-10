# Nest API structure — common layer

> **DEPRECATED:** `apps/api` đã xóa. Target = **`~/workspace/fast-api-base`** — [FAST-API-STRUCTURE](../../../fast-api-base/docs/operational/FAST-API-STRUCTURE.md) · [factory-ai-stack](./factory-ai-stack.md).

Port Laravel `api/src/app/Http/*` traits/bases → `apps/api/src/common/` (**archived**).

| Laravel | Nest (`apps/api/src/common/`) |
|---------|-------------------------------|
| `BaseController` success/error | `http/api-response.ts` + `ApiResponseInterceptor` + `ApiExceptionFilter` |
| `Entry*Trait` | Controller → `CommandBus` / `QueryBus` |
| `BaseAction` | `crud/base-write.handler.ts` |
| `BaseQuery` + `BaseCriteria` | `crud/base-read.query.ts` + `criteria/base-criteria.ts` |
| `BaseResource` | `crud/base-resource.ts` |
| `SelectItem*Trait` | `crud/select-item.query.ts` |
| `FormRequest` rules | `ZodValidationPipe` + `@portal/models` WriteSchema |
| Eloquent repository | `TypeOrmModule.forFeature` + `createTypeormWriteRepository` |
| Module `ChainAction` / `ChainQuery` | `modules/{module}/*.base.ts` (scope tenant/chain) |

---

## CQRS wiring

```text
Controller (thin)
  → QueryBus.execute(GetXQuery)  → QueryHandler → BaseReadQuery
  → CommandBus.execute(CreateXCommand) → CommandHandler → BaseWriteHandler
```

`nest-gen` sinh Command/Query/Handler per endpoint; common base không copy per feature.

---

## ORM (TypeORM / Prisma)

- **Contract** = Zod (`@portal/models`) — FE + validation
- **Persistence** = TypeORM entities (`@Column` decorators) + `DatabaseModule` (MySQL)
- **ORM metadata** = `*.relationships.meta.ts` — relation sync trong `BaseWriteHandler`

`persistence.orm: typeorm | prisma` trên từng field — `nest-gen` chọn generator template.

Pivot M-N: không model pivot — sync trong `BaseWriteHandler` (giống Laravel `entity-relationship.md`).

---

## Layout module

```text
apps/api/src/modules/{module}/
  {module}.module.ts
  {entity}/
    {entity}.controller.ts
    commands/
    queries/
    handlers/
    {entity}.resource.ts
```

Không `nwidart` / không workspace package per module.
