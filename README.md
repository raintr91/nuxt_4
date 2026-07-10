# Portal Base (Next.js 15)

Auth-first Next.js — shadcn dashboard, kiến trúc 4 tầng trong `src/`, harness AI cho feature mới.  
Workspace còn `packages/models` (`@portal/models`).

## Quick start

```bash
pnpm install
pnpm dev
```

FE tại root (mặc định port 3000). API: `~/workspace/fast-api-base` `:4000`.

## Commands

| Command | Mô tả |
|---------|--------|
| `pnpm dev` | Next dev |
| `pnpm build` | Next production build |
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

Auth-first skeleton: `/login`, `/` (protected dashboard), middleware cookie `auth_token`.

API client (`apiFetch` trong `src/lib/api-client.ts`) gọi `NEXT_PUBLIC_API_URL/api/*`.

## Team AI harness

Commands và skills: [docs/operational/FEATURE-ARTIFACT-FLOWS.md](docs/operational/FEATURE-ARTIFACT-FLOWS.md) · [docs/operational/PROMPT-TEMPLATES.md](docs/operational/PROMPT-TEMPLATES.md). AI harness nằm trong `.cursor/` và `.kilo/`.
