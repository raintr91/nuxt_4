# Shared project maps (Cursor + Kilo)

**SSOT at repo root** — không nhét riêng trong `.cursor/` hay `.kilo/config/`.

| File | Mục đích |
|------|----------|
| [`platform-repos.example.json`](../../platform-repos.example.json) | Template — copy → `platform-repos.json` hoặc `platform-repos.local.json` |
| [`legacy-repos.example.json`](../../legacy-repos.example.json) | Template legacy checkouts |
| [`platform-repos.json`](../../platform-repos.json) | Live map (committed) — groups + contract FE↔BE |
| [`legacy-repos.json`](../../legacy-repos.json) | Legacy roots for `/legacy-spec` — **rỗng** trên cụm base |
| `platform-repos.local.json` | Machine override (gitignored) |
| `legacy-repos.local.json` | Machine override (gitignored) |

## Base cluster (workspace)

| Key | Path (từ portal) | Role |
|-----|------------------|------|
| `portal` | `.` | Nuxt 4 FE |
| `nextjs` | `../nextjs` | Next.js FE |
| `nuxt-nest` | `../nuxt_nest` | Nuxt 4 + NestJS |
| `next-nest` | `../next_nest` | Next.js + NestJS |
| `fast-api-base` | `../fast-api-base` | FastAPI BE |
| `api` | `../api` | Laravel 12 BE |
| `integration` | `../integration` | .NET BE |
| `line` | `../line` | WinForms (override `D:` trong `.local.json`) |

Mỗi base tự giữ `platform-ai/` + `./scripts/platform-ai-link` — không sync đè skill giữa stack. Migrate một lần: `./scripts/platform-ai-migrate-to-ssot` (copy `.cursor` → `platform-ai/` của **chính repo đó**).

## Resolve order (agents)

1. `{workspace}/platform-repos.local.json` / `legacy-repos.local.json`
2. `{workspace}/platform-repos.json` / `legacy-repos.json`
3. `{workspace}/platform-repos.example.json` / `legacy-repos.example.json` (template only)
4. Optional user home: `~/.cursor/platform-repos.json`

Never guess absolute paths. Extract: `platform-ai/extracts/legacy/project-config.md`.

## Rename note (from older layout)

| Cũ | Mới |
|----|-----|
| `.cursor/team-projects.example.json` | `platform-repos.example.json` |
| `.cursor/legacy-projects.example.json` | `legacy-repos.example.json` |
| `team-projects.json` | `platform-repos.json` |
| `.kilo/config/team-projects.json` | `platform-repos.json` |

## Local override

```bash
cp platform-repos.example.json platform-repos.local.json
# edit roots for this machine
```
