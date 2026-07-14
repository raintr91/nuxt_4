# Feature artifact — lệnh script

> Bảng tra cứu · Diagram: [FEATURE-ARTIFACT-FLOWS](./FEATURE-ARTIFACT-FLOWS.md)  
> **Layout folder gen/registry (global):** [CODEGEN-LAYOUT](./CODEGEN-LAYOUT.md)  
> Codegen chi tiết tag/registry: [PORTAL-CODEGEN](./PORTAL-CODEGEN.md)

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
| `pnpm platform-common:registry` | Validate logic common registry (`registries/common.registry.json`) |
| `pnpm portal:gen:dry --spec .../ir/spec.yaml` | Gate sau dev-grill (không ghi file) |
| `pnpm portal:gen:dry` | Glob mọi `yaml/**/ir/spec.yaml` |
| `pnpm portal:gen --spec .../ir/spec.yaml` | Scaffold app + `generated/HANDOFF.md` |
| `pnpm portal:gen --spec ... --force` | Overwrite file đã gen |
| `pnpm portal:remove --spec .../ir/spec.yaml` | Xóa scaffold theo manifest |
| `pnpm portal:lifecycle sync` | Đồng bộ page registry |

**Output:** `{function}/generated/codegen.manifest.json`, `HANDOFF.md` + layers app.

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

## Platform mark (`/platform-mark`)

Member marks common UI + logic — grill hỏi trước khi gắn tag. Hub: [PLATFORM-MARK](./PLATFORM-MARK.md)

| Lệnh / skill | Mục đích |
|--------------|----------|
| `/platform-mark` | Gắn `#needs-component`, `#common:*`, … vào `ir/spec.yaml` + registry |
| `/dev-grill-docs` | In bảng **Common candidates** — member A/B/C |
| `pnpm platform-common:registry` | Validate `registries/common.registry.json` |

---

## AI infra

| Lệnh | Mục đích |
|------|----------|
| `./scripts/cursor-export-kilo` | Optional: mirror `.cursor/` SSOT → `.kilo/` (sau sửa skill nếu dùng Kilo) |
| Root `platform-repos.json` | Cross-repo map — [PROJECT-MAPS](./PROJECT-MAPS.md) |
| `pnpm extracts:validate` | Skill `extractBundle` ⊆ registry |

---

## Ví dụ end-to-end (hotel-list)

```bash
# Sau dev-grill
pnpm spec:split -- docs/features/yaml/admin/hotel/list/hotel-list.bundle.yaml
pnpm portal:gen:dry --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm portal:gen --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm docs:render

pnpm portal:unit-gen --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm testcase:gen --feature admin/hotel
```

Thứ tự team command: [DESIGN-PHASE-DIAGRAM](./DESIGN-PHASE-DIAGRAM.md) · [FEATURE-ARTIFACT-FLOWS](./FEATURE-ARTIFACT-FLOWS.md)
