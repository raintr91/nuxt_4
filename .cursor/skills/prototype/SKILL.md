---
name: prototype
extractBundle: prototype
description: /prototype — UI from hub ir/spec with mock API.
disable-model-invocation: true
---

# /prototype — UI Prototype (Mock API Boundary)

Hub guide: `base-docs/platform/toolchain/PORTAL-CODEGEN.md` · layout: `FEATURE-ARTIFACT-LAYOUT.md` · [HUBS](base-docs/platform/toolchain/HUBS.md)

**Extracts:** `extractBundle: prototype` → `.cursor/extracts/extract-registry.json`

## Artifact (only)

**Load:** hub Code `ir/spec.yaml` via **`--id`** (vd. `W-AD-AUTH-001`) — input `portal:gen`.

```text
base-docs/product/components/{CMP-…}/code/{W-…}/ir/spec.yaml
base-docs/product/common/…/code/…/ir/spec.yaml   # shared
```

**Do not load:** bundle, `ir/legacy.yaml`, `ir/design.yaml`, trace, legacy source, handbook MD.

Prerequisite: docs-lane grill xong (`grillStatus.dev: done` trên hub); dry-run OK:

```bash
pnpm portal:gen:dry --id W-AD-AUTH-001
# or Artifactgraph MCP genDry
```

## Artifactgraph MCP (local-first)

1. `analyze` với `specPath` = hub `ir/spec.yaml` (hoặc path resolve dưới `specRoots`) — gaps / draftTags.
2. **`gen`** / `pnpm portal:gen --id …` — allowlist; **không** bịa argv; **không** `--spec docs/features/…`.
3. HANDOFF `#needs-component` / `#needs-ui` tại:

```text
base-docs/product/…/code/{W-…}/generated/HANDOFF.md
```

   - Mo* **đã có** `registries/design.registry.json` → wire local only
   - **Chưa có** → cloud chỉ `cloudPromptSlice` — không dump registry/page
4. Mo* mới ổn → **promote** design/common registry trên **FE repo** + MCP `rebuild` + `remember`

## Workflow

1. Scan `tags` + `ui.columns` (`render: custom`) → implement missing `Mo*` only.
2. Scaffold:

```bash
pnpm portal:gen --id W-AD-AUTH-001
pnpm portal:gen --id W-AD-AUTH-001 --force   # rerun
```

3. Auth bypass trên route prototype; vá gap trong HANDOFF.
4. `#wire-only` → defer `/wire`; scoped lint/typecheck.

Docs render / `spec:split` chạy trên **base-docs** — không từ code repo.

## Spec edits

- **Không** sửa business contract trong bundle/ir khi prototype.
- Promote: `base-docs/platform/toolchain/DESIGN-REGISTRY-PROMOTION.md` **sau** prototype + reuse.

## Handoff

`data-testid` per `base-docs/platform/toolchain/E2E-TESTIDS.md` · `/grill-prototype` · `/test` · `/wire`
