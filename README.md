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
| `pnpm storybook` | UI catalog (port 6006) |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright |
| `pnpm portal:gen --id <W-…\|CMP-…>` | FE codegen (IR trên docs hub) |
| `pnpm testcase:gen --id <W-…\|TC-…>` | Gen Playwright từ tests hub |

## Repo này

Skeleton: `/auth/*`, `/password/reset/*`, `/` (protected), `404`, `forbidden`.  
Chi tiết: `pages/`, `middleware/`, `components/`, `composables/`, `services/`, `stores/`.

API client (`$apiFetch`) dùng prefix **`/api/auth/*`**.

Codegen / registries / unitgen / testgen: `codegen/`, `registries/`, `unitgen/`, `testgen/`.

## AI harness (code lane)

Skills: `.cursor/skills/` (`/prototype` · `/grill-prototype` · `/platform-base` · `/wire` · `/test` · `/unit` · `/model` · `/platform-mark`) · rules: `.cursor/rules/`.  
Gen / gaps / tags: **Artifactgraph MCP** + `pnpm portal:gen` / `testcase:gen` / `unit-gen`.
