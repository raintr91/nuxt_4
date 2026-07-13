---
name: flow-trace
extractBundle: flow-trace
description: /flow-trace — cross-system flow steps → docs/flow-trace/ (read-only repos)
disable-model-invocation: true
---

# /flow-trace

Technical path map — not spec/UI design. Hub: `docs/flow-trace/index.md`

**Extracts:** `flow-trace` → `.cursor/extracts/flow-trace.md` (template + step vocabulary)

## Load

| Load | Skip |
|------|------|
| `legacy/project-config.md`, legacy/API/scenario/fullsco routes·jobs·mail | `ir/design.yaml`, codegen, `portal:gen` |
| Portal bundles — `api`/routes only | `docs:render`, `testcase:gen` |

Repos: resolve `team-projects.json` / `legacy-projects.json` — list at start; gaps if missing checkout. **Write:** only `docs/flow-trace/`.

## Output

- `docs/flow-trace/{flow-slug}.md` — sections: `Steps`, `Diagram` (one mermaid), `Gaps?`
- Update `index.md` link · draft: `.harness/flow-trace/{slug}.md`

## Workflow

1. Flow name + slug + actors
2. Grep routes, controllers, jobs, mail across repos
3. Numbered steps per extract format · one `sequenceDiagram`
4. Handoff gaps → `/legacy-spec` · `/spec` · `/api`

## Do not

Edit bundles · run `portal:gen` · UI/layout prose
