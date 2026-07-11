# Grill tech-debt

Defer open questions across phases. Tag: `#tech-debt:{question-id}` — id matches `openQuestions[].id`.

## Flow

1. Grill asks → member defers → `openQuestions` + tag
2. Target phase **step 0:** scan open items for this `deferTo` → re-ask (batch ≤5)
3. Resolved → patch spec, `status: resolved`, **remove tag**

```yaml
openQuestions:
  - id: bulk-delete-endpoint
    question: ...
    status: open          # open | resolved
    deferTo: dev-grill-docs
tags:
  - "#tech-debt: bulk-delete-endpoint"
```

## deferTo

`bqa-grill-docs` | `dev-grill-docs` | `grill-with-docs` | `prototype` | `wire` | `api`

Do not re-ask resolved items. Related: `codegen/tags.md` (`#wire-only` ≠ tech-debt).
