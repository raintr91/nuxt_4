# Incremental spec blocks — `/spec` multi-turn

Design v1 without `codegen`. User types short bullets; agent accumulates `ui.blocks[]` across sessions.

## Block hints

```text
/spec hotel-list                    → 4–10 bullet overview (first turn)
/spec hotel-list block:shell
/spec hotel-list block:title
/spec hotel-list block:search
/spec hotel-list block:toolbar
/spec hotel-list block:table
/spec hotel-list block:row-actions
/spec hotel-list block:column:status
```

No `block:` → ask which block, or default `shell` when file is new.

## YAML shape

```yaml
id: hotel-list
title: Danh sách hotel
summary: Trang list hotel admin.

specProgress:
  blocksDone: 3
  blocksTotal: 6
  phase: design-v1

ui:
  blocks:
    - id: shell
      status: done          # pending | grilling | done
      breadcrumb: ...
      pageTitle: ...
    - id: search
      status: done
      fields: [...]
    - id: toolbar
      status: pending
```

## Rules

- Do **not** add `codegen`, `ui.filters`, `ui.columns`, or portal-gen `tags` in `/spec`.
- Merge blocks into one `*.bundle.yaml` per child function (`spec/split.md`).
- When all blocks `done` → normalize into `design.zones[]` before `/bqa-grill-docs` (zones SSOT; see `docs/operational/DESIGN-PHASE-DIAGRAM.md`); handoff `/bqa-grill-docs` not `/grill-with-docs` first.
- `pnpm docs:render` after YAML edits (user or agent).

## Grill mapping

| Block ids | BQA owns | Dev derives |
|-----------|----------|-------------|
| shell, title, breadcrumb | copy, hierarchy | `ui.routes`, route meta |
| search, toolbar, table, row-actions | UX, copy, actions | `ui.filters`, `ui.columns`, `tags` |
