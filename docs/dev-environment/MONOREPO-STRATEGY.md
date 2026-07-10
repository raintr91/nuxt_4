# Monorepo — một `node_modules`, packages chỉ code

Mục tiêu: dev nhẹ, release khả thi, module/package **chỉ chứa source** — dependency hoist ở root.

---

## Hiện trạng portal (2026)

| Thành phần | Vị trí |
|------------|--------|
| Next.js 15 FE | `src` (`portal`) |
| Zod contracts | `packages/models` (`@portal/models`) |
| **FastAPI (target BE)** | `~/workspace/fast-api-base` — repo riêng, `:4000` |
| `pnpm-workspace` | `.`, `packages/*` |

**Local dev wire:** `NEXT_PUBLIC_API_URL=http://127.0.0.1:4000` + chạy fast-api-base song song `pnpm dev`.

**Local Docker:** `docker/docker-compose.yml` — có thể thêm fast service (W1)  
**Prod:** FastAPI image từ `fast-api-base/docker` · Next build (`src`)

---

## Hướng A — pnpm workspace (đang áp dụng)

### Cấu trúc

```
portal/
├── package.json              # orchestration scripts
├── pnpm-workspace.yaml
├── src/                 # Next.js — app/, hooks/, services/, components/
├── packages/models/          # @portal/models — contract:gen
└── docker/

~/workspace/fast-api-base/    # FastAPI backend (Factory AI)
```

Chạy từ root:

```bash
pnpm install
pnpm dev                      # Next @ src
# FastAPI (repo riêng):
# cd ~/workspace/fast-api-base && PYTHONPATH=src .venv/bin/uvicorn app.main:app --port 4000 --app-dir src
pnpm build
```

Codegen & phase diagrams: [REPO-SPLIT-MAP](../operational/REPO-SPLIT-MAP.md) · [BACKEND-CODEGEN](../operational/BACKEND-CODEGEN.md) · [ARCHITECTURE](../operational/ARCHITECTURE.md).

### Migration tiếp theo (optional)

1. ~~Tách `models/` → `packages/models`~~ — done (`@portal/models`)
2. ~~Move FE → `src`~~ — done
3. Tách shared UI package chỉ khi có app FE thứ hai

---

## Hướng B — Laravel API (legacy reference)

```
api/
  src/
    vendor/              # ← duy nhất (Composer)
    Modules/
      Hotel/             # chỉ PHP — không vendor riêng
```

Module = code + `composer.json` optional (path repo). **Không** nhân `vendor/` per module.

---

## Production Docker

| App | Image |
|-----|--------|
| Nest API | `docker/api/Dockerfile` multi-stage |
| Next FE | CI build `src` → Node image hoặc static host |

```dockerfile
# docker/api/Dockerfile — chỉ api + models
COPY packages/models packages/models
COPY apps/api apps/api
RUN pnpm --filter @portal/api build
```

---

## Không nên

| Anti-pattern | Lý do |
|--------------|-------|
| Mỗi module copy full `package.json` + `pnpm install` | N× node_modules |
| `.pnpm-store` trong từng app | 60k+ files × N |
| Dev host + dev Docker cùng app | 2× RAM + watcher |

---

## Quyết định nhanh

| Câu hỏi | Trả lời |
|---------|---------|
| Next FE ở đâu? | `src` (`portal`) |
| Nest API? | `apps/api` — prod Docker riêng |
| Zod SSOT? | `packages/models` — `contract:gen` |
| Prod FE? | Next build artifact — runtime do member chọn |
