# Page lifecycle registry

Nguồn máy đọc: `registries/page-lifecycle.registry.json`.

**Tự cập nhật:** `portal:gen` → `prototype`; `portal:remove` → `design-spec`; `pnpm portal:lifecycle sync` quét manifest + page trên disk.

## Bước chính (không ghi sub-step)

| Stage | Ý nghĩa | Auth trên dev |
|-------|---------|---------------|
| `design-spec` | Spec/testcase có; chưa có prototype code | bypass |
| `prototype` | UI + mock API (`portal:gen`) | bypass |
| `test` | E2E/unit pass (vẫn mock API) | bypass |
| `wire` | Ghép API thật xong | **required** |

**Quy tắc:** `stage` = bước cao nhất đã đạt. Sửa spec / re-grill không tự hạ stage. `portal:remove` hoặc `lifecycle sync` (page mất) hạ về `design-spec`.

```bash
pnpm portal:lifecycle sync
pnpm portal:lifecycle set /hotels test
pnpm portal:remove --spec docs/features/.../feature.spec.yaml
```

## Routes

| Path | Stage | Auth | Spec | Title | Updated |
|------|-------|------|------|-------|---------|
| /admin/chains | design-spec | bypass | `docs/features/yaml/admin/chain/list/ir/spec.yaml` | Quản lý chain admin | 2026-07-09 |
| /admin/chains/create | design-spec | bypass | `docs/features/yaml/admin/chain/form/ir/spec.yaml` | Tạo / cập nhật chain admin | 2026-07-09 |
| /admin/hotels | design-spec | bypass | `docs/features/yaml/admin/hotel/list/ir/spec.yaml` | Admin hotel list | 2026-06-27 |
| /hotels | test | bypass | `docs/features/yaml/admin/chain/login-as/ir/spec.yaml` | Chain — danh sách hotel (施設一覧) | 2026-07-08 |
| /sample-items | prototype | bypass | `docs/features/yaml/_example/contract-pilot/ir/spec.yaml` | Contract gen pilot | 2026-07-09 |

## Liên quan

- Auth bypass: mọi stage **trừ** `wire` — `src/middleware.ts`
- Xóa code: `pnpm portal:remove --spec <file>`
- Session handoff: `.harness/progress.md`
