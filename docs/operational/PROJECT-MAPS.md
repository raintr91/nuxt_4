# Shared project maps (Cursor + Kilo)

**SSOT at repo root** — không nhét riêng trong `.cursor/` hay `.kilo/config/`.

| File | Mục đích |
|------|----------|
| [`platform-repos.example.json`](../../platform-repos.example.json) | Template — copy → `platform-repos.json` hoặc `platform-repos.local.json` |
| [`legacy-repos.example.json`](../../legacy-repos.example.json) | Template legacy checkouts |
| [`platform-repos.json`](../../platform-repos.json) | Live map (committed) — groups + contract FE↔BE |
| [`legacy-repos.json`](../../legacy-repos.json) | Legacy roots for `/legacy-spec` |
| `platform-repos.local.json` | Machine override (gitignored) |
| `legacy-repos.local.json` | Machine override (gitignored) |

## Resolve order (agents)

1. `{workspace}/platform-repos.local.json` / `legacy-repos.local.json`
2. `{workspace}/platform-repos.json` / `legacy-repos.json`
3. `{workspace}/platform-repos.example.json` / `legacy-repos.example.json` (template only — không dùng path thật nếu chưa copy)
4. Optional user home: `~/.cursor/platform-repos.json` (personal, ngoài repo)

Never guess absolute paths. Extract: `platform-ai/extracts/legacy/project-config.md` (mirrored to `.cursor/extracts/`).

## Rename note (from older layout)

| Cũ | Mới |
|----|-----|
| `.cursor/team-projects.example.json` | `platform-repos.example.json` |
| `.cursor/legacy-projects.example.json` | `legacy-repos.example.json` |
| `.kilo/config/team-projects.json` | `platform-repos.json` |
| `.kilo/config/legacy-projects.json` | `legacy-repos.json` |

Aligned with `~/factory/portal` naming.

## Local override

```bash
cp platform-repos.example.json platform-repos.local.json
# edit roots for this machine
```
