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
artifactgraph init                              # agents: ↑↓ · Space · Enter
# artifactgraph init --target=cursor,claude,kilo --yes
cd ~/workspace/portal && artifactgraph init-project && artifactgraph rebuild
```

| Lệnh | Việc |
|------|------|
| `init` | Wire MCP vào Cursor / Claude / Kilo (**máy**, mặc định global) |
| `init-project` | `artifactgraph.json` trong **từng** product base |
| `install` | Alias deprecated → `init` |

## Local-first (important)

| Local (MCP + member) | Cloud model |
|----------------------|-------------|
| Grill A/B/C: common vs feature-only | Implement Mo* / logic **chưa có** mẫu |
| Confirm blocks khi không clone legacy | Legacy symbol **chưa** có history |
| **Parity-drift** create≠edit / empty / FE≠BE | Cùng turn: trả `parityFindings[]` (schema) |
| gen allowlist + wire Mo* đã có registry | Chỉ `cloudPromptSlice` đã nén |

Detail: [ARTIFACTGRAPH-INTERNALS](./ARTIFACTGRAPH-INTERNALS.md) · extract `legacy/parity.md` · package `docs/PARITY.md` · hooks: `platform-ai/extracts/artifactgraph-phase-hooks.md`

## In this repo

- Rule: `platform-ai/rules/artifactgraph.mdc` (alwaysApply)
- Skill: `/artifactgraph`
- Map: `platform-repos.json` → project **`artifactgraph`**
- Product wire: `artifactgraph.json` + `.artifactgraph/`
