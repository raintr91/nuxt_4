# Feature artifact — lệnh script

> Bảng tra cứu · Diagram: [FEATURE-ARTIFACT-FLOWS](./FEATURE-ARTIFACT-FLOWS.md)  
> Codegen FE: [PORTAL-CODEGEN](./PORTAL-CODEGEN.md) · Codegen BE: [BACKEND-CODEGEN](./BACKEND-CODEGEN.md)

---

## Authoring & IR

| Lệnh | Input | Output / hiệu ứng |
|------|--------|-------------------|
| `pnpm spec:convert -- <legacy.spec.yaml>` | Spec cũ (one-off) | `yaml/.../{id}.bundle.yaml` |
| `pnpm spec:normalize-gen -- <bundle> --write` | Bundle trộn spec+gen | Tách `spec` design v1 ↔ `gen` |
| `pnpm spec:split -- <bundle.yaml>` | Bundle SSOT | `ir/spec.yaml`, `ir/legacy.yaml`, `ir/design.yaml` |
| `pnpm spec:merge -- <bundle.yaml>` | `ir/*` đã sửa tay | Cập nhật bundle (đặc biệt `gen`) |
| `pnpm spec:split:check -- <bundle.yaml>` | Bundle + ir | Exit 1 nếu lệch |
| `pnpm spec:split:all` | Mọi `yaml/**/*.bundle.yaml` | Quét thư mục, split + verify từng bundle |

---

## Common (shared) — tách khỏi features

Common component specs nằm ở `docs/common/yaml/{function}/`, dùng lại và ít thay đổi. **Không** chạy qua `portal:gen` / `docs:render` / `spec:split:all` của features — dùng lệnh riêng bên dưới.

| Lệnh | Mục đích |
|------|----------|
| `pnpm spec:split:common` | Split mọi `common/yaml/**/*.bundle.yaml` |
| `pnpm docs:render:common` | Render `common/yaml` → `common/md` (không ghi index features) |
| `pnpm portal:gen:dry:common` | Dry gen common (cần `codegen.profile` trong mỗi spec) |
| `pnpm portal:gen:common` | Gen common (cần `codegen.profile`) |



## Phase aggregates (1 lệnh/phase)

Lệnh tổng hợp chạy tuần tự các bước hạt nhân của mỗi phase. Lệnh hạt nhân ở các bảng trên **vẫn giữ nguyên** để tech review từng bước mà không phụ thuộc AI.

| Lệnh | Chạy tuần tự | Dùng sau |
|------|--------------|----------|
| `pnpm phase:spec -- <bundle.yaml>` | `spec:split` → `spec:split:check` → `docs:render` | Sửa 1 bundle xong |
| `pnpm phase:spec` (không arg) | `spec:split:all` → `docs:render` | Quét toàn bộ `yaml/**` |
| `pnpm phase:gen -- --spec <ir/spec.yaml>` | `portal:gen:dry` → `portal:gen` → `docs:render` | Dev-grill xong |
| `pnpm phase:unit -- --spec <ir/spec.yaml>` | `portal:unit-gen:dry` → `portal:unit-gen` | Gen xong |
| `pnpm phase:e2e -- <feature>` | `testcase:gen:dry` → `testcase:gen` → `test:e2e` | Testcase viết xong |
| `pnpm phase:common` | `spec:split:common` → `docs:render:common` | Common component specs |

> `docs:render` (render toàn bộ) và `test:e2e` (chạy toàn bộ spec) không nhận path arg — runner tự bỏ arg ở 2 bước đó. Runner: `scripts/run-phase.mjs`.

## Legacy trace

| Lệnh | Mục đích |
|------|----------|
| `pnpm legacy-trace:validate -- <_legacy.trace.yaml>` | Schema + index/slice consistency |

---

## Codegen — app (`portal:gen`)

**Input duy nhất:** `docs/features/yaml/.../{function}/ir/spec.yaml`

| Lệnh | Mục đích |
|------|----------|
| `pnpm portal:registry` | Validate design registry |
| `pnpm portal:gen:dry --spec .../ir/spec.yaml` | Gate sau dev-grill (không ghi file) |
| `pnpm portal:gen:dry` | Glob mọi `yaml/**/ir/spec.yaml` |
| `pnpm portal:gen --spec .../ir/spec.yaml` | Scaffold app + `generated/HANDOFF.md` |
| `pnpm portal:gen --spec ... --force` | Overwrite file đã gen |
| `pnpm portal:remove --spec .../ir/spec.yaml` | Xóa scaffold theo manifest |
| `pnpm portal:lifecycle sync` | Đồng bộ page registry |

**Output:** `{function}/generated/codegen.manifest.json`, `HANDOFF.md` + layers app (không `models/` — dùng `contract:gen`).

---

## Contract (`contract:gen`)

**Input:** `ir/spec.yaml` — `entities[].fields[]` ([CONTRACT-FIELD-REGISTRY](./CONTRACT-FIELD-REGISTRY.md))

| Lệnh | Mục đích |
|------|----------|
| `pnpm contract:registry` | Validate `shared/contract-field.registry.json` |
| `pnpm contract:gen:dry --spec .../ir/spec.yaml` | Plan Zod + relationships.meta |
| `pnpm contract:gen --spec .../ir/spec.yaml` | Write `packages/models/src/...` |
| `pnpm contract:gen --spec ... --force` | Overwrite |

**Output:** `packages/models/...`, `{function}/generated/contract.manifest.json`

---

## Fast API (`fast-gen` — repo `fast-api-base`)

> **Spec SSOT trong fast-api-base** — `docs/features/yaml/.../`. Không author `backend/` trên portal.  
> **Python-native** — `./scripts/*` + `make test` (không pnpm / không E2E). Docs site: MkDocs `./scripts/docs-dev` `:8001`. Chi tiết: fast `docs/operational/FAST-ARTIFACT-COMMANDS.md` · [REPO-SPLIT-MAP](./REPO-SPLIT-MAP.md)

| Lệnh | Mục đích |
|------|----------|
| `./scripts/spec-split …/{function}.bundle.yaml` | bundle → `ir/spec.yaml` + `backend/01-backend-spec.yaml` |
| `./scripts/spec-split-all` | Quét `docs/features/yaml/**/*.bundle.yaml` |
| `./scripts/spec-merge …/{function}.bundle.yaml` | `ir/*` → bundle SSOT |
| `./scripts/docs-render` | bundle → `docs/features/md/` |
| `./scripts/fast-gen registry` | Validate `shared/fast-codegen.registry.json` |
| `./scripts/fast-gen dry --spec …/backend/01-backend-spec.yaml` | Plan module scaffold |
| `./scripts/fast-gen write --spec …/backend/01-backend-spec.yaml` | Write `src/app/modules/...` |
| `./scripts/fast-gen openapi --spec …/backend/02-openapi.yaml` | Write `backend/02-openapi.yaml` |
| `./scripts/fast-unit-gen write --spec …` | pytest scaffold |
| `make test` | pytest API + `*.api-test.yaml` contract (thay vitest) |
| `./scripts/docs-dev` | MkDocs Material preview `:8001` (thay VitePress) |

**Prerequisite:** `pnpm contract:gen` (portal) cho `@portal/models` — cùng field keys.

**Dev server:**

```bash
cd ~/workspace/fast-api-base
PYTHONPATH=src .venv/bin/uvicorn app.main:app --port 4000 --app-dir src
```

**Skills (fast-api-base):** `/fast-spec` → `/grill-fast-spec` → `/fast-code`

---

## Line client (`line-gen` — repo `line`)

> **Spec SSOT trong line** — `docs/features/yaml/.../ir/spec.yaml` (`clients.line`).  
> **.NET-native** — không pnpm. Docs: DocFX `./scripts/docs-dev` `:8081`.

| Lệnh | Mục đích |
|------|----------|
| `./scripts/spec-split …/workforce.bundle.yaml` | `portal-feature-bundle/v1` → `ir/{spec,legacy,design}.yaml` |
| `./scripts/spec-split-all` · `./scripts/spec-merge` · `./scripts/docs-render` | Parity portal tooling |
| `./scripts/docs-dev` | DocFX preview `:8081` (thay VitePress) |
| `./scripts/line-gen dry --spec …/ir/spec.yaml` | Scriban dry (`tools/LineGen`) |
| `./scripts/line-gen write --spec …/ir/spec.yaml` | Write `src/Line.App/Generated/` |
| `./scripts/contract-sync --openapi …/backend/02-openapi.yaml` | Keys ↔ `Line.Contracts` |
| `./scripts/smoke-wire.sh` | Curl fast check-in |
| `dotnet test` | xUnit only (thay vitest) |

**Skills (line):** `/line-spec` → `/grill-line-spec` → `/line-prototype` → `/line-wire` → `/grill-line-api`

Docs: `~/workspace/line/docs/operational/LINE-ARTIFACT-COMMANDS.md`

---

## Integration OT (`integration-gen` — repo `integration`)

> **Spec SSOT trong integration** — `docs/features/yaml/.../integration/01-integration-spec.yaml`.  
> **.NET-native** — không pnpm. Docs: DocFX `./scripts/docs-dev` `:8082`.

| Lệnh | Mục đích |
|------|----------|
| `./scripts/spec-split …/downtime.bundle.yaml` | bundle → ir + `integration/01-integration-spec.yaml` |
| `./scripts/docs-render` · `./scripts/docs-dev` | md + DocFX `:8082` |
| `./scripts/integration-gen dry --spec …/01-integration-spec.yaml` | Scriban dry |
| `./scripts/integration-gen write --spec …/01-integration-spec.yaml` | Write `src/Integration.*/Generated/` |
| `dotnet test` | xUnit only (thay vitest) |

**Skills (integration):** `/integration-spec` → `/grill-integration-spec` → `/integration-code` → `/grill-integration`

Docs: `~/workspace/integration/docs/operational/INTEGRATION-ARTIFACT-COMMANDS.md`

---

## Unit tests (`portal:unit-gen`)

| Lệnh | Mục đích |
|------|----------|
| `pnpm portal:unit-registry` | Validate unit registry |
| `pnpm portal:unit-gen:dry --spec .../ir/spec.yaml` | Dry plan |
| `pnpm portal:unit-gen --spec .../ir/spec.yaml` | Smoke + `unit.manifest.json` |
| `pnpm portal:unit-gen --spec ... --phase wire` | Sau `/wire` |
| `pnpm exec vitest run tests/unit/...` | Scoped verify |

---

## E2E (`testcase:gen`)

| Lệnh | Mục đích |
|------|----------|
| `pnpm portal:e2e-registry` | Validate E2E registry |
| `pnpm testcase:gen:dry --testcase yaml/.../hotel-list.test.yaml` | Dry một file |
| `pnpm testcase:gen --feature admin/hotel` | Glob `yaml/admin/hotel/**/*.test.yaml` |
| `pnpm test:e2e tests/e2e/...` | Chạy spec |

---

## AI infra

| Lệnh | Mục đích |
|------|----------|
| `pnpm extracts:validate` | Skill `extractBundle` ⊆ registry |

---

## Ví dụ end-to-end (hotel-list)

```bash
# Sau dev-grill (portal)
pnpm spec:split -- docs/features/yaml/admin/hotel/list/hotel-list.bundle.yaml
pnpm portal:gen:dry --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm portal:gen --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm docs:render

pnpm portal:unit-gen --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm testcase:gen --feature admin/hotel

# Backend (fast-api-base) — Factory AI
pnpm contract:gen --spec docs/features/yaml/factory/knowledge-hub/ir/spec.yaml
cd ~/workspace/fast-api-base && ./scripts/spec-split-all && ./scripts/fast-gen write --spec docs/features/yaml/factory/knowledge-hub/backend/01-backend-spec.yaml
```

Thứ tự team command: [DESIGN-PHASE-DIAGRAM](./DESIGN-PHASE-DIAGRAM.md) · [FEATURE-ARTIFACT-FLOWS](./FEATURE-ARTIFACT-FLOWS.md)
