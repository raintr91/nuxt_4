# Backend / API phase (Nest in-repo)

> **DEPRECATED:** Backend phase target = **fast-api-base** (`~/workspace/fast-api-base/docs/operational/FAST-BACKEND-PHASE-DIAGRAM.md`) · [factory-ai-stack](./factory-ai-stack.md).

> Hub: [BACKEND-CODEGEN](./BACKEND-CODEGEN.md) · [TEAM-AI-BACKEND-WORKFLOW](./TEAM-AI-BACKEND-WORKFLOW.md) · [FULL-CYCLE-PIPELINE-DIAGRAM](./FULL-CYCLE-PIPELINE-DIAGRAM)

Phase **2c API** — chạy **song song** portal scaffold (2a) và E2E prep (2b); converge tại **Wire** (phase 3).

---

## API cycle (tổng)

```mermaid
flowchart TD
  IN["ir/spec.yaml + entities.fields"] --> CG["pnpm contract:gen"]
  CG --> MODELS["packages/models"]
  IN --> S1["/api-spec"]
  S1 --> BE["backend/01 · 02 · 03"]
  BE --> OG["pnpm openapi:gen"]
  OG --> GS["/grill-api-spec\nnest:gen:dry"]
  GS --> APR{"approval\napproved?"}
  APR -->|no| US["/api-update-spec"]
  APR -->|yes| C["/api-code\npnpm nest:gen"]
  C --> NUG["pnpm nest:unit-gen"]
  NUG --> JEST["pnpm --filter @portal/api test"]
  JEST --> GA["/grill-api"]
  GA --> WIRE["/wire"]
  US --> GS
  IN -.->|portal delta| US
```

---

## Sub-lane: Contract (`contract:gen`)

```mermaid
flowchart LR
  IR["ir/spec.yaml\nentities[].fields"]
  REG["contract-field.registry.json"]
  GEN["pnpm contract:gen"]
  OUT["packages/models/src/\n*.read.schema.ts\n*.relationships.meta.ts"]
  PG["portal:gen imports\n@portal/models"]

  IR --> GEN
  REG --> GEN
  GEN --> OUT
  OUT --> PG
```

Chi tiết field `kind`, scopes, relation: [CONTRACT-FIELD-REGISTRY](./CONTRACT-FIELD-REGISTRY.md).

---

## Sub-lane: Codegen (`nest:gen` + `openapi:gen`)

```mermaid
flowchart TD
  BE["01-backend-spec.yaml"]
  OG["openapi:gen → 02-openapi.yaml"]
  NG["nest:gen"]
  MOD["apps/api/src/modules/"]
  PRISMA["prisma/models/*.prisma"]
  MAN["generated/codegen.manifest.json"]

  BE --> OG
  BE --> NG
  NG --> MOD
  NG --> PRISMA
  NG --> MAN
```

Cấu trúc module CQRS: [NEST-API-STRUCTURE](./NEST-API-STRUCTURE.md) · Dev local: [BACKEND-API-QUICKSTART](./BACKEND-API-QUICKSTART.md).

---

## Sub-lane: API unit (Jest)

**Không gộp diagram này** — xem file riêng: [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md).

Tóm tắt: `nest:gen` → `nest:unit-gen` → `pnpm --filter @portal/api test` → `/grill-api` → `/wire`.

---

## Command chain

| Mục tiêu | Chuỗi |
|----------|--------|
| Contract Zod | dev-grill fill `entities.fields` → `pnpm contract:gen` |
| Feature backend mới | `/api-spec` → `openapi:gen` → `/grill-api-spec` → `/api-code` |
| Portal đổi spec | `/api-update-spec` → `/grill-api-spec` → … |
| API unit verify | `nest:unit-gen` → Jest green → `/grill-api` |

---

## Lệnh mẫu

```bash
pnpm contract:gen:dry --spec docs/features/yaml/.../ir/spec.yaml
pnpm contract:gen --spec docs/features/yaml/.../ir/spec.yaml
pnpm openapi:gen --spec docs/features/yaml/.../backend/01-backend-spec.yaml
pnpm nest:gen:dry --spec docs/features/yaml/.../backend/01-backend-spec.yaml
pnpm nest:gen --spec .../backend/01-backend-spec.yaml --force
pnpm nest:unit-gen --spec .../backend/01-backend-spec.yaml --force
pnpm --filter @portal/api test
pnpm dev:api
```

Pilot: `docs/features/yaml/_example/contract-pilot/`

---

## Liên kết

| Doc | Nội dung |
|-----|----------|
| [BACKEND-CODEGEN](./BACKEND-CODEGEN.md) | Hub script backend |
| [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md) | Jest lane chi tiết |
| [CONTRACT-FIELD-REGISTRY](./CONTRACT-FIELD-REGISTRY.md) | Field registry |
| [NEST-API-STRUCTURE](./NEST-API-STRUCTURE.md) | Common layer |
| [WIRE-PHASE-DIAGRAM](./WIRE-PHASE-DIAGRAM.md) | Sau `/api-code` |
| [PORTAL-CODEGEN](./PORTAL-CODEGEN.md) | `portal:gen` (FE, không models) |
| [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md) | Vitest portal (song song) |
| [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md) | E2E (song song) |

Legacy Laravel `~/workspace/api` — read-only reference khi port pattern.
