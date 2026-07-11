# Grill — Spec Validation + Decision Resolution

**Not** domain archaeology. Legacy facts live in `ir/legacy.yaml` / trace.

## Step A — fact-lock

- Compare `ir/design` vs `ir/legacy` (ui slice) vs `common-ui-spec.md`.
- Delete/breadcrumb touchpoints: read `common-delete-flow.md`, `common-breadcrumb-flow.md` on demand.
- Fix conflicts in bundle → `pnpm spec:split`.
- Do not add `openQuestions` until `grillStatus.bqaFacts: done`.

## Step B — open-pass

- Ask member for product decisions not in evidence.
- Record in `openQuestions` + tags (`#phase-api`, …).

## Questions (examples)

- `requirements` vs `legacy.behaviors[id]` conflict — which wins?
- Missing API field vs `legacy.fields` — add or tag?
- Codegen constraint from `portal:gen:dry` failure?

## Do not

- Re-read legacy source or `models/` (handoff → `/update-spec-legacy`).
- Use generated `.md` as grill input.
