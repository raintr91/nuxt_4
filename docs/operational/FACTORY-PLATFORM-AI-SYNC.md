# Factory platform-ai sync

Đồng bộ skill/rule/extract SSOT từ workspace **base** repos sang `~/factory` (deploy repos).

## Mapping

| Workspace base | Factory repo | Role |
|----------------|--------------|------|
| `~/workspace/portal` | `~/factory/portal` | Next.js FE |
| `~/workspace/fast-api-base` | `~/factory/api` | FastAPI |
| `~/workspace/integration` | `~/factory/gateway` | OT gateway |
| `~/workspace/line` | `/mnt/d/workspace/station` | Shop-floor client (optional) |

Khớp `platform-repos.json` trong từng factory repo.

## Lệnh

```bash
cd ~/workspace/portal
./scripts/factory-platform-ai-sync.sh          # all
./scripts/factory-platform-ai-sync.sh portal   # một repo
./scripts/factory-platform-ai-sync.sh api
./scripts/factory-platform-ai-sync.sh gateway
./scripts/factory-platform-ai-sync.sh station
```

Env override:

```bash
WORKSPACE_ROOT=~/workspace FACTORY_ROOT=~/factory ./scripts/factory-platform-ai-sync.sh
```

## Sync gì

Mỗi repo (portal/api/gateway):

- `platform-ai/` (SSOT — skills, rules, extracts)
- `scripts/platform-ai-link` (+ migrate helper nếu có)
- Chạy `platform-ai-link` trong repo đích → mirror `.cursor/` + `.kilo/`

Thêm theo repo:

| Repo | Extra |
|------|--------|
| portal | `platform-common-registry.mjs`, `shared/platform-common.registry.json`, `PLATFORM-MARK.md`, artifact docs |
| api | `platform-common-registry`, shared registry, `PLATFORM-MARK.md` |
| gateway | integration operational docs |
| station | `.cursor/skills` từ line (chưa có platform-ai SSOT) |

## Workflow team

1. Sửa SSOT trên **workspace base** (`platform-ai/` + docs)
2. `./scripts/platform-ai-link` trong base repo
3. `./scripts/factory-platform-ai-sync.sh` → factory repos
4. Commit `platform-ai/` (+ docs) trên **cả base và factory** tương ứng

## Lưu ý

- Factory portal đang migrate sang layout `platform-*` (từ `portal-*` cũ) — sync ghi đè SSOT mới.
- Mirror `.cursor/` gitignored trên base; factory portal có thể vẫn track `.cursor` — ưu tiên commit `platform-ai/` sau sync.
