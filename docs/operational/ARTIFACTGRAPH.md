# Artifactgraph MCP (portal pointer)

Package / GitHub: **[raintr91/artifactgraph](https://github.com/raintr91/artifactgraph)**

**Chi tiết lệnh:** sibling package [`docs/INIT.md`](../../../artifactgraph/docs/INIT.md) (hoặc GitHub `docs/INIT.md`).

## Bootstrap

| OS | Command |
|----|---------|
| **Linux / WSL** | `curl -fsSL https://raw.githubusercontent.com/raintr91/artifactgraph/main/install.sh \| bash` |
| **Windows** | `irm https://raw.githubusercontent.com/raintr91/artifactgraph/main/install.ps1 \| iex` |
| **npx** | `npx --yes github:raintr91/artifactgraph` |

```bash
artifactgraph version
# Prefer project MCP (token): only loads when this workspace is open
cd ~/workspace/portal
artifactgraph init --location=local --target=cursor --yes
artifactgraph init-project && artifactgraph rebuild
```

| Lệnh | Việc |
|------|------|
| `init --location=local` | Wire MCP vào **`.cursor/mcp.json` của repo** (khuyến nghị) |
| `init` (global) | Mọi project — **tránh**: MCP tool schema vào mọi chat |
| `init-project` | `artifactgraph.json` trong **từng** product base |
| `install` | Alias deprecated → `init` |

### Token / MCP

- **Project:** `portal/.cursor/mcp.json` — ArtifactGraph chỉ khi mở portal.
- **Global Win:** `%USERPROFILE%\.cursor\mcp.json` — giữ CodeGraph (nếu cần); **không** để `artifactgraph` / `qa-git` ở đây.
- Skill/grill mới cần tools; ad-hoc dùng CLI: `artifactgraph parity|gaps|status|gen …`.
- Rule `artifactgraph.mdc` = **opt-in** (`alwaysApply: false`), không inject mọi chat.

## Local-first (important)

| Local (MCP + member) | Cloud model |
|----------------------|-------------|
| Grill A/B/C: common vs feature-only | Implement Mo* / logic **chưa có** mẫu |
| Confirm blocks khi không clone legacy | Legacy symbol **chưa** có history |
| **Parity-drift** create≠edit / empty / FE≠BE | Cùng turn: trả `parityFindings[]` (schema) |
| gen allowlist + wire Mo* đã có registry | Chỉ `cloudPromptSlice` đã nén |

Detail: [ARTIFACTGRAPH-INTERNALS](./ARTIFACTGRAPH-INTERNALS.md) · extract `legacy/parity.md` · package `docs/PARITY.md` · hooks: `.cursor/extracts/artifactgraph-phase-hooks.md`

## In this repo

- Rule: `.cursor/rules/artifactgraph.mdc` (opt-in)
- Skill: `/artifactgraph`
- MCP: `.cursor/mcp.json` (project) · Win host → `wsl.exe` + `artifactgraph-mcp`
- **DSL config:** `artifactgraph.json` (`commands` + `dsl.lanes`) — registries path list only; payloads in `registries/`
- Map: `platform-repos.json` → project **`artifactgraph`**
- Detail: [ARTIFACTGRAPH-INTERNALS](./ARTIFACTGRAPH-INTERNALS.md) · hooks extract
