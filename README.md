# Platform Base (Nuxt 4)

Auth-first Nuxt 4 — shadcn dashboard, kiến trúc 4 tầng, harness AI (code lane).

## Quick start

```bash
pnpm install
pnpm dev
```

`devServer` listen `0.0.0.0`. WSL ext4: watch polling tắt mặc định — bật `NUXT_WATCH_POLLING=1` khi Docker hoặc project trên `/mnt/c`.

## Commands

| Command | Mô tả |
|---------|--------|
| `pnpm dev` | Nuxt dev |
| `pnpm build` / `preview` | Production build |
| `pnpm storybook` | UI catalog (port 6006) |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright |

Codegen / testgen / registry: chạy trực tiếp CLI toolkit sau `platform-dna init` — `codegenkit gen|unit-gen|registry --adapter=nuxt4`, `testkit testcase:gen|e2e-registry`. Không giữ engine hoặc wrapper trong product repo.

## Repo này

Skeleton: `/auth/*`, `/password/reset/*`, `/` (protected), `404`, `forbidden`.  
Chi tiết: `pages/`, `middleware/`, `components/`, `composables/`, `services/`, `stores/`.

API client (`$apiFetch`) dùng prefix **`/api/auth/*`**.

Registries product: `registries/`. Engines gen/unitgen sống trong Codegenkit; testcase engine sống trong Testkit.

Product docs + architecture → [`base-docs`](https://github.com/raintr91/base_docs). E2E plans → [`base-tests`](https://github.com/raintr91/base_test).

## AI harness (code lane)

Skills: `/prototype` · `/grill-prototype` · `/platform-base` · `/platform-mark` · `/wire` · `/test` · `/unit` · `/model` (+ grill-*)  
BE/fullstack: thêm `/api` · `/grill-api`.

Gen / gaps: **Artifactgraph MCP** + `codegenkit gen --id …` / `testkit testcase:gen --id …` / `codegenkit unit-gen`.

| Always | Theo file / slash |
|--------|-------------------|
| `platform-ai.mdc` | `platform-invariants` · contract-naming · base-ui/e2e/data · size/split/import · design-vocab · team-flow-prototype/unit/e2e/wire/model · codegraph |

SSOT harness: `.cursor/` tại repo này (sync bằng toolkit `init`).
