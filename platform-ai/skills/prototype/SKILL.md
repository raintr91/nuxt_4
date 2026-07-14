---
name: prototype
extractBundle: prototype
description: /prototype — UI from ir/spec with mock API.
disable-model-invocation: true
---

# /prototype — UI Prototype (Mock API Boundary)

Doc hub: `docs/operational/PORTAL-CODEGEN.md`

**Extracts:** `extractBundle: prototype` → `.cursor/extracts/extract-registry.json`

## Artifact (only)

**Load:** `docs/features/yaml/.../{function}/ir/spec.yaml` — portal-gen input.

**Do not load:** bundle, `ir/legacy.yaml`, `ir/design.yaml`, trace, legacy source.

Prerequisite: `grillStatus.dev: done`; gen dry passed (`artifactgraph_gen` `genDry` hoặc `pnpm portal:gen:dry`).

## Artifactgraph (local-first)

1. `artifactgraph_analyze` với `specPath` = `ir/spec.yaml` — xem gaps / draft.
2. **`artifactgraph_gen` `gen`** (hoặc `pnpm portal:gen`) — allowlist; không bịa argv.
3. HANDOFF `#needs-component` / `#needs-ui`:
   - Mo* **đã có** registry → wire local only
   - **Chưa có** → cloud chỉ `cloudPromptSlice` (slot + props + 1–2 Mo* tham chiếu) — không gửi cả page/registry
4. Sau Mo* mới ổn → **promote registry trong product repo** + `rebuild` + `artifactgraph_remember`

## Workflow

1. Scan `tags` + `ui.columns` (`render: custom`) → implement missing `Mo*` only (per slice above).
2. Gen scaffold: MCP `gen` hoặc **`pnpm portal:gen --spec docs/features/yaml/.../ir/spec.yaml`** (`--force` if rerun).
   - HANDOFF: `{function}/generated/HANDOFF.md` (cạnh bundle, không trong `ir/`)
3. Auth bypass on prototype routes; fix gaps in HANDOFF.
4. `#wire-only` → defer `/wire`; scoped lint/typecheck.

Gen tự chạy `pnpm docs:render` (local script).

## Spec edits

- **Không** sửa business contract trong bundle/ir during prototype.
- Registry promote → `docs/operational/DESIGN-REGISTRY-PROMOTION.md` **after** prototype + reuse.

## Handoff

`data-testid` per E2E-TESTIDS · `/grill-prototype` · `/test` · `/wire`
