# Platform Base (Nuxt 4)

Auth-first Nuxt 4 template — shadcn dashboard, kiến trúc 4 tầng, harness AI cho feature mới.

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
| `pnpm test:e2e` | Playwright — đọc [E2E-TESTIDS](docs/operational/E2E-TESTIDS.md) trước |
| `pnpm docs:dev` | VitePress (`pnpm docs:render` trước) |

## Documentation

- [Docs hub](docs/index.md)
- [Architecture](docs/operational/ARCHITECTURE.md)
- [Feature artifact flows](docs/operational/FEATURE-ARTIFACT-FLOWS.md)
- [Common UI](docs/common-ui/index.md)
- [Docker / WSL](docs/dev-environment/DOCKER-DEV-LIGHT.md) · [Cursor perf](docs/dev-environment/WSL-CURSOR-PERF.md)

## Repo này

Auth-first skeleton: `/auth/*`, `/password/reset/*`, `/` (protected), `404`, `forbidden`. Chi tiết route/middleware: `pages/`, `middleware/`.

API client (`$apiFetch`) dùng prefix **`/api/auth/*`**.

## Team AI harness

Commands và skills: [docs/operational/FEATURE-ARTIFACT-FLOWS.md](docs/operational/FEATURE-ARTIFACT-FLOWS.md) · [docs/operational/PROMPT-TEMPLATES.md](docs/operational/PROMPT-TEMPLATES.md). AI harness hiện nằm trong `.cursor/extracts/` và `.cursor/skills/`.
