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

Prerequisite: `grillStatus.dev: done`; `pnpm portal:gen:dry --spec .../ir/spec.yaml` passed.

## Workflow

1. Scan `tags` + `ui.columns` (`render: custom`) → implement missing `Mo*` only.
2. **`pnpm portal:gen --spec docs/features/yaml/.../ir/spec.yaml`** (`--force` if rerun).
   - HANDOFF: `{function}/generated/HANDOFF.md` (cạnh bundle, không trong `ir/`)
3. Auth bypass on prototype routes; fix gaps in HANDOFF.
4. `#wire-only` → defer `/wire`; scoped lint/typecheck.

Gen tự chạy `pnpm docs:render` (local script).

## Spec edits

- **Không** sửa business contract trong bundle/ir during prototype.
- Registry promote → `docs/operational/DESIGN-REGISTRY-PROMOTION.md` **after** prototype + reuse.

## Handoff

`data-testid` per E2E-TESTIDS · `/grill-prototype` · `/test` · `/wire`
