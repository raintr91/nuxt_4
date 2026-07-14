---
name: spec
extractBundle: spec-requirement
description: /spec — author bundle + testcase round 1.
disable-model-invocation: true
---

# /spec — Feature Spec + Testcase Round 1

**Extracts:** `extractBundle: spec-requirement` → `.cursor/extracts/extract-registry.json`

Template: `docs/templates/feature.bundle.yaml` · rules: `docs/templates/bundle-authoring.md`

## Scope

**In:** `docs/features/yaml/**/{id}.bundle.yaml`, testcase round 1, `pnpm docs:render`, harness notes.

**Out (handoff):** legacy code analysis → `/legacy-spec`; codegen → `/bqa-grill-docs` then `/dev-grill-docs`; UI code → `/prototype`.

## Workflow

1. If bundle exists, verify gaps: actors, fields, validations, routes, actions, API contracts, edge cases, acceptance.
2. If new, draft from user bullets — output `*.bundle.yaml` with `specOrigin: requirement`.
   - **Artifactgraph:** `analyze --bullets` local; apply known common/UI aliases; **confirm generated blocks với member (local)** — không cloud.
3. **Incremental blocks** — optional `block:{id}` hints per `spec-incremental-blocks.md`; accumulate blocks → normalize into `design.zones[]` when đủ block.
4. Apply common UI and spec-split rules from extracts.
5. Draft `{id}.test.yaml` round 1 aligned with acceptance criteria.
6. `pnpm spec:split -- <bundle>` then `pnpm docs:render`.
7. Update `.harness/progress.md` when present.

## Output shape (portal-feature-bundle/v1)

- `spec` — design v1 only (see `bundle-authoring.md`)
- `design` — `zones[]`, `behavior`, `actions[]` (structured, không prose blob)
- `review.layoutNotes` — prose BA khi cần
- **Không** `gen` section — dev-grill thêm sau

**Output rule:** YAML only per schema. No explanation. No markdown.

## Rules

- Do not edit `pages/`, `components/`, `composables/`, `services/`, or production mocks.
- Do not run `portal:gen` — that is `/prototype` after `/dev-grill-docs`.
- Do not add `codegen`, `tags`, `ui.filters`, `ui.columns` in `/spec` round 1.
- Do not run full Playwright/Vitest; deferred to `/prototype`, `/test`, or `/unit`.
- If spec is vague, hand off to `/bqa-grill-docs` before `/prototype`.
- If source of truth is legacy code without spec, use `/legacy-spec` first — not `/spec`.

## Done

- Design v1 bundle + round-1 testcase YAML are coherent.
- `pnpm spec:split` + `pnpm docs:render` pass.
- Open questions in `openQuestions`, not only in chat.
- Handoff → `/bqa-grill-docs` (không legacy-spec).
