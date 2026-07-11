# Grill docs — role split

Single source for `/bqa-grill-docs`, `/dev-grill-docs`, `/grill-with-docs`.

## Order

```
design v1 (legacy-spec | spec) → bqa-grill-docs → dev-grill-docs → [grill-with-docs] → prototype
```

| Step | Command | When skip |
|------|---------|-----------|
| 1 | `/bqa-grill-docs` | Never on new feature |
| 2 | `/dev-grill-docs` | Never before prototype |
| 3 | `/grill-with-docs` | BQA+Dev done, no contradiction |
| Gate | `pnpm portal:gen:dry` | After dev (or full) |

## Section ownership

| Section | BQA | Dev | Full |
|---------|-----|-----|------|
| `requirements` | edit | read | edit |
| `ui.screens`, `ui.blocks` | edit | derive | reconcile |
| `acceptance`, testcase YAML | edit | read | edit |
| `ui.routes` | read | edit | edit |
| `api`, `entities`, `relationships` | read | edit | edit |
| `ui.composition`, `ui.filters`, `ui.columns` | read | edit | edit |
| `codegen`, `tags` | — | edit | edit |
| UX `openQuestions` | edit | read | edit |
| Tech `openQuestions` | read | edit | edit |

## BQA focus

Actions, copy, layout, controls (dropdown, tab, checkbox column), empty/error **from user view**.  
Reference: `common-ui-spec.md`, `yaml/common/list-page/common-list-page.bundle.yaml`.

## Dev focus

Route path, API contract, filter/column mapping, `codegen`, `#needs-component`, `#needs-common`, `#common:`, `#wire-only`.  
Reference: `codegen/readiness.md`, `codegen/tags.md`, `platform-mark-detect.md`.

## grillStatus (optional metadata)

```yaml
grillStatus:
  bqa: done       # pending | done | skipped
  dev: done       # pending | done
  full: not_required
```

## Handoff

- BQA done → `/dev-grill-docs`
- Dev dry pass → `/prototype`
- Contradiction → `/grill-with-docs` then dev dry again
