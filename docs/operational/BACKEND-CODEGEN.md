# Backend codegen — `contract:gen` + `nest:gen` + `nest:unit-gen`

> **Doc chính backend (đọc file này trước).** Lệnh tra cứu: [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md) · Flow: [BACKEND-PHASE-DIAGRAM](./BACKEND-PHASE-DIAGRAM.md).  
> **API unit lane (Jest):** [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md) · **Portal Vitest:** [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md)

Ba pipeline backend **tách script**, **tách registry** — song song portal `portal:gen`:

| Pipeline | Lệnh | Registry | Output |
|----------|------|----------|--------|
| **Contract Zod** | `pnpm contract:gen` | `registries/contract-field.registry.json` | `packages/models/src/…` |
| **Nest scaffold** | `pnpm nest:gen` | `registries/nest-codegen.registry.json` | `apps/api/src/modules/…` |
| **API unit tests** | `pnpm nest:unit-gen` | `registries/nest-unit-test.registry.json` | `apps/api/…/*.spec.ts` (Jest) |
| **OpenAPI artifact** | `pnpm openapi:gen` | — | `backend/02-openapi.yaml` |

---

## Thứ tự chạy (feature backend mới)

```text
/dev-grill-docs  →  ir/spec.yaml + entities.fields
       ↓
pnpm contract:gen --spec …/ir/spec.yaml
       ↓
/api-spec  →  backend/01-backend-spec.yaml (+ 03-mock)
       ↓
pnpm openapi:gen --spec …/backend/01-backend-spec.yaml
       ↓
/grill-api-spec  →  nest:gen:dry · approval approved
       ↓
/api-code  →  pnpm nest:gen --spec …/backend/01-backend-spec.yaml
       ↓
pnpm nest:unit-gen --spec …/backend/01-backend-spec.yaml
       ↓
pnpm --filter @portal/api test   — [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md)
       ↓
/grill-api  →  audit HANDOFF · repository wiring
       ↓
/wire  — [WIRE-PHASE-DIAGRAM](./WIRE-PHASE-DIAGRAM.md)
```

**Prerequisite:** `portal:gen` **không** sinh models — luôn `contract:gen` trước ([PORTAL-CODEGEN](./PORTAL-CODEGEN.md)).

---

## Lệnh nhanh

### Contract — `contract:gen`

```bash
pnpm contract:registry
pnpm contract:gen:dry --spec docs/features/yaml/.../ir/spec.yaml
pnpm contract:gen --spec docs/features/yaml/.../ir/spec.yaml
```

### Nest — `nest:gen`

```bash
pnpm nest:registry
pnpm nest:gen:dry --spec docs/features/yaml/.../backend/01-backend-spec.yaml
pnpm nest:gen --spec …/backend/01-backend-spec.yaml --force
pnpm dev:api
```

### OpenAPI artifact

```bash
pnpm openapi:gen:dry --spec …/backend/01-backend-spec.yaml
pnpm openapi:gen --spec …/backend/01-backend-spec.yaml
```

### API unit — `nest:unit-gen`

```bash
pnpm nest:unit-registry
pnpm nest:unit-gen:dry --spec …/backend/01-backend-spec.yaml
pnpm nest:unit-gen --spec …/backend/01-backend-spec.yaml --force
pnpm --filter @portal/api test
```

---

## Output paths

```text
docs/features/yaml/{role}/{domain}/{function}/
  ir/spec.yaml
  backend/
    01-backend-spec.yaml
    02-openapi.yaml
    03-mock-data.yaml
  generated/
    contract.manifest.json
    codegen.manifest.json
    HANDOFF.md

packages/models/src/{entity}/     # contract:gen
apps/api/src/modules/{module}/    # nest:gen
apps/api/prisma/models/           # prisma fragment (optional)
```

Layout: [BACKEND-ARTIFACT-LAYOUT](../features/BACKEND-ARTIFACT-LAYOUT.md) · Quickstart: [BACKEND-API-QUICKSTART](./BACKEND-API-QUICKSTART.md)

---

## Liên kết

| Doc | Mục đích |
|-----|----------|
| [TEAM-AI-BACKEND-WORKFLOW](./TEAM-AI-BACKEND-WORKFLOW.md) | Skills + command router |
| [CONTRACT-FIELD-REGISTRY](./CONTRACT-FIELD-REGISTRY.md) | `entities.fields` SSOT |
| [NEST-API-STRUCTURE](./NEST-API-STRUCTURE.md) | CQRS + common layer |
| [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md) | Jest lane chi tiết |
| [PORTAL-CODEGEN](./PORTAL-CODEGEN.md) | FE scaffold (song song) |
