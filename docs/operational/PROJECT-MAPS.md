# Shared project maps (Cursor + Kilo)

**SSOT at repo root** — không nhét riêng trong `.cursor/` hay `.kilo/config/`.

| File | Mục đích |
|------|----------|
| [`team-projects.example.json`](../team-projects.example.json) | Template — copy → `team-projects.json` hoặc `team-projects.local.json` |
| [`legacy-projects.example.json`](../legacy-projects.example.json) | Template legacy checkouts |
| [`team-projects.json`](../team-projects.json) | Live map (committed) — Factory AI + optional stacks |
| [`legacy-projects.json`](../legacy-projects.json) | Live legacy roots (committed) |
| `team-projects.local.json` | Machine override (gitignored) |
| `legacy-projects.local.json` | Machine override (gitignored) |

## Resolve order (agents)

1. `{workspace}/team-projects.local.json` / `legacy-projects.local.json`
2. `{workspace}/team-projects.json` / `legacy-projects.json`
3. `{workspace}/team-projects.example.json` / `legacy-projects.example.json` (template only — không dùng path thật nếu chưa copy)
4. Optional user home: `~/.cursor/team-projects.json` (personal, ngoài repo)

Never guess absolute paths. Extract: `.cursor/extracts/legacy/project-config.md`
