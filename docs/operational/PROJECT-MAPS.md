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
| [`platform-bases.code-workspace`](../../platform-bases.code-workspace) | **Multi-root Cursor/VS Code** — folders = `defaultGroup` (**R1**) |

## Multi-root workspace (R1 — agent edit cross-repo)

Cursor **không** đọc `platform-repos.json` như ACL ghi. Edit sibling `../api` khi chỉ mở folder `portal/` → External File Protection (Accept từng lần).

**Cách đúng:** mở workspace sinh từ map:

```bash
pnpm platform:workspace
# → platform-bases.code-workspace

pnpm platform:workspace:sync
# copy script + regenerate trên mọi sibling platform-bases
```

Cursor: **File → Open Workspace from File…** → `platform-bases.code-workspace` (không “Open Folder” một repo lẻ).

| Flag | Việc |
|------|------|
| `--group=<id>` | Group trong `groups` (mặc định `defaultGroup`) |
| `--out=<file>` | Tên file workspace |
| `--include-readonly` | Giữ project `write: false` |
| `--sync-bases` | Copy script + regenerate từng sibling |

Sau `python3 scripts/sync-platform-repos-bases.py`, chạy lại `pnpm platform:workspace:sync` nếu roots đổi. **Không** tắt External File Protection global — multi-root từ map mới là R1.

## Base cluster (workspace)

Mỗi product base + MCP giữ **cùng catalog** `platform-bases` (9 keys). Root relative tới repo đang mở (từ portal: siblings `../…`). Field `stack` dùng cho artifactgraph MCP (`nuxt4`, `nextjs`, `fastapi`, …).

| Key | Path (từ portal) | Role | stack |
|-----|------------------|------|-------|
| `portal` | `.` | Nuxt 4 FE | `nuxt4` |
| `nextjs` | `../nextjs` | Next.js FE | `nextjs` |
| `nuxt-nest` | `../nuxt_nest` | Nuxt 4 + NestJS | `nuxt4-nest` |
| `next-nest` | `../next_nest` | Next.js + NestJS | `nextjs-nest` |
| `fast-api-base` | `../fast-api-base` | FastAPI BE | `fastapi` |
| `api` | `../api` | Laravel 12 BE | `laravel` |
| `integration` | `../integration` | .NET BE | `dotnet-integration` |
| `line` | `../line` | WinForms (override `D:` trong `.local.json`) | `dotnet-line` |
| `artifactgraph` | `../artifactgraph` | MCP tooling (gaps/tags/gen) | `mcp` |

**Đồng bộ map:** `python3 scripts/sync-platform-repos-bases.py` (portal) — ghi `platform-repos.json` lên mọi sibling base + MCP (`workspaceRoot: ".."` trong artifactgraph).

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
