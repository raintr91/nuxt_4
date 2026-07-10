# Docker dev — stack nhẹ & WSL 24GB

## Vì sao `gateway up-all` + portal/api giết WSL (~5 phút)?

**Không phải vì portal “nặng hơn” Nuxt khác** — vì bạn bật **cả hạ tầng shared**:

| `make up-all` (~/gateway) | RAM ước lượng |
|---------------------------|---------------|
| MySQL **8.4** + MySQL **8.0** (2 instance!) | 1–2 GB mỗi cái khi warm |
| PostgreSQL 17 + pgAdmin | ~500 MB–1 GB |
| phpMyAdmin | ~200 MB |
| Redis + Redis Commander | ~100–200 MB |
| **LocalStack** (S3/SQS/SNS) | **512 MB–2 GB** |
| Mailpit, mock-api, StackPort | ~200–400 MB |
| gateway nginx | nhẹ |

**+ portal docker:** `node:24` + `pnpm install` + `pnpm dev` (Next)  
**+ api docker:** PHP-FPM + nginx  
**+ (tuỳ chọn)** `docker-compose.external.yml` → thêm mairy PHP/nginx/node  

→ Dễ **vượt 12–16 GB** chỉ Docker, cộng WSL + Cursor + **host `node_modules` 779MB + `.pnpm-store` 884MB** → OOM killer dập WSL.

Dự án Laravel/Nuxt khác: thường **1 DB + 1 app**, không có LocalStack, không 2 MySQL, không gateway 20+ virtual host.

---

## Stack tối thiểu cho portal + api base

Chỉ cần MySQL + gateway TLS:

```bash
cd ~/gateway
make ensure-shared-network ensure-gateway-sites
make up-gateway    # nginx 80/443
make up-mysql      # mysql 8.4 + 8.0 + phpmyadmin — vẫn 2 mysql, xem note bên dưới
```

Portal + API:

```bash
cd ~/workspace/portal/docker && docker compose up -d
cd ~/workspace/api/docker && docker compose up -d
```

**Không chạy** (trừ khi cần):

```bash
make up-postgres      # SaaS / one-crm
make up-localstack    # S3/SQS — rất nặng
make up-redis
make external-up      # mairy stack
```

### Gợi ý tách profile (tự chạy từng nhóm)

| Nhu cầu | Lệnh |
|---------|------|
| Chỉ portal + api base | `up-gateway` + `up-mysql` + portal/api compose |
| Cần S3 local | thêm `up-localstack` |
| Cần SaaS PG | thêm `up-postgres` |
| Full team | `up-all` (chỉ khi đủ RAM / không mở Cursor nặng) |

---

## Một nguồn `node_modules` — không chạy dev 2 nơi

| Cách | Khi nào |
|------|---------|
| **A. Dev trong Docker** (khuyến nghị với gateway) | `portal/docker up` — **không** `pnpm dev` trên host |
| **B. Dev trên host** | `pnpm dev` — **không** bật `portal/docker` frontend-node |

Chạy **cả hai** = 2× watcher + 2× `node_modules` (host + volume Docker).

Đã chỉnh `portal/docker/docker-compose.yml`:

- `node_modules` + `.pnpm-store` → **named volume** (che bản nặng trên host)
- Polling **tắt mặc định** — bật khi mount chậm: `CHOKIDAR_USEPOLLING=1` trong `.env` docker

Dọn host (một lần):

```bash
cd ~/workspace/portal
rm -rf .pnpm-store    # ~884MB, ~61k files
# .npmrc đã trỏ store global ~/.local/share/pnpm/store
```

---

## Giới hạn RAM container (tuỳ chọn)

Thêm vào `~/gateway/.env` hoặc từng service trong compose:

```yaml
deploy:
  resources:
    limits:
      memory: 512M
```

Ưu tiên giới hạn: **localstack**, **mysql-80** (nếu chỉ dùng mysql 8.4), **phpmyadmin**.

---

## Production có khả thi không?

**Có.** Độ nặng hiện tại là **local dev harness**, không phải artifact release:

| Layer | Dev (nặng) | Production (nhẹ) |
|-------|------------|------------------|
| Portal | node_modules, Vitest, polling | `next build` (`src`) → standalone image |
| API | full `vendor/`, dev tools | `composer install --no-dev` + PHP-FPM image |
| Gateway stack | 10+ containers | 1 ingress + managed DB (RDS) — không LocalStack |

Release **không** ship `.pnpm-store`, không 2 MySQL, không chạy `next dev` trong prod.

---

## Monorepo 1 `node_modules` — packages chỉ code

Xem chi tiết: [`MONOREPO-STRATEGY.md`](MONOREPO-STRATEGY.md)

Tóm tắt **pnpm workspace**:

```
workspace/
  package.json          # workspace root
  pnpm-workspace.yaml
  node_modules/         # DUY NHẤT (hoisted)
  apps/
    web/                  # portal — Next.js
  packages/
    ui/                 # chỉ src + package.json (peer deps)
    models/
    eslint-config/
```

Laravel API đã gần đúng: **một `vendor/`** tại `api/src`, modules chỉ PHP code.

---

## Checklist khi WSL die

1. `docker stats` — service nào RAM cao?
2. `make stop-all` trong gateway — WSL còn sống không?
3. Tắt `up-localstack` + `up-postgres` nếu không dùng
4. Chỉ dev portal **hoặc** Docker, không cả hai
5. Xóa `.pnpm-store` trên host
6. Mở Cursor folder `portal/` không phải `workspace/`
