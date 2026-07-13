# Backend codegen — `contract:gen` + `fast-gen` (Factory AI)

> **DEPRECATED (Nest):** `nest:gen`, `nest:unit-gen`, `apps/api` đã xóa khỏi portal. Backend target = **`~/workspace/fast-api-base`** — xem `fast-api-base/docs/operational/FAST-CODEGEN.md` · [factory-ai-stack](./factory-ai-stack.md) · [REPO-SPLIT-MAP](./REPO-SPLIT-MAP.md).

> **Doc chính backend (đọc file này trước).** Lệnh tra cứu: [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md) · Flow: [BACKEND-PHASE-DIAGRAM](./BACKEND-PHASE-DIAGRAM.md).  
> **Portal Vitest:** [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md)

| Pipeline | Lệnh | Registry | Output |
|----------|------|----------|--------|
| **Contract Zod** | `pnpm contract:gen` | `registries/contract-field.registry.json` | `packages/models/src/…` |
| **FastAPI scaffold** | `fast-gen write` | `fast-api-base/registries/codegen.registry.json` | `fast-api-base/src/app/modules/…` |
| **FastAPI unit tests** | `fast-unit-gen write` | `fast-api-base/registries/unit-test.registry.json` | `fast-api-base/tests/` |
| **OpenAPI artifact** | `fast-gen openapi` | — | `backend/02-openapi.yaml` |

---

## Legacy Nest (archived)

Các lệnh `pnpm nest:gen`, `pnpm nest:unit-gen`, `pnpm openapi:gen` **đã gỡ**. Tham chiếu lịch sử: git history · [NEST-API-STRUCTURE](./NEST-API-STRUCTURE.md).

---

## Thứ tự chạy (feature backend mới — Factory AI)

```text
/dev-grill-docs  →  ir/spec.yaml + entities.fields
       ↓
pnpm contract:gen --spec …/ir/spec.yaml
       ↓
/fast-spec  →  backend/01-backend-spec.yaml (+ 03-mock optional)
       ↓
/grill-fast-spec  →  fast-gen dry · approval approved
       ↓
/fast-code  →  fast-gen write --spec …/backend/01-backend-spec.yaml
       ↓
fast-gen openapi  →  backend/02-openapi.yaml
       ↓
fast-unit-gen write  →  pytest green
       ↓
/grill-api  →  audit keys + envelope + pagination
       ↓
/wire  — [WIRE-PHASE-DIAGRAM](./WIRE-PHASE-DIAGRAM.md)
```

Diagram: fast `FAST-BACKEND-PHASE-DIAGRAM.md` · Contract hub: [CONTRACT-PORTAL-FAST](./CONTRACT-PORTAL-FAST.md).

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
