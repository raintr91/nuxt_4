# Update-spec delta matrix

Controlled patch after design v1 — **do not** restart from `/legacy-spec` or full `/spec` unless direction is wrong.

## Commands

| Command | When |
|---------|------|
| `/update-spec` | Gap from grill-prototype, grill-test, wire, or requirement change |
| `/update-spec-legacy` | Re-check legacy evidence for the same delta |

## Patch → tag

| Change | Tag | Follow-up |
|--------|-----|-----------|
| New `ui.blocks` entry | `#update:add-block:{id}` | `portal:gen` if prototype exists |
| Edit block | `#update:modify-block:{id}` | `portal:gen [--force]` |
| Remove block | `#update:remove-block:{id}` | `portal:gen --force` |
| API contract delta | `#update:api:{id}` | API repo + `/wire` |
| Testcase / acceptance | `#update:test:{id}` | `testcase:gen` or `/grill-test` |

## Lifecycle fields

- Bump `specRevision` on every confirmed delta.
- If `featureStatus` was `wire` → set `need-update` until `/wire` again.
- Tags **stay** through `portal:gen` / `testcase:gen`; cleared **only** at `/wire`.

## Scope guardrails

- Patch only affected sections — do not rewrite unrelated `ui.blocks` or evidence.
- Do not add `codegen` in `/update-spec` unless Dev confirms — prefer `/dev-grill-docs` for codegen deltas.
- Legacy path: cite `inferredFromCode` when re-opening evidence.

See `spec-update-tags.md`, `feature-lifecycle-status.md`.
