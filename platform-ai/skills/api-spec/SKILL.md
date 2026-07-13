---
name: api-spec
extractBundle: api-spec
description: /api-spec — backend contract YAML in feature backend/ folder.
disable-model-invocation: true
---

# /api-spec

Output: `docs/features/yaml/.../{function}/backend/01-backend-spec.yaml` (+ openapi, mock).

Input: `ir/spec.yaml`, testcases, `entities.fields`.

Guide: `docs/templates/backend-api.yaml` · `docs/operational/TEAM-AI-BACKEND-WORKFLOW.md`

Handoff → `/grill-api-spec` (not `/api-code`).

After backend spec exists:

```bash
pnpm openapi:gen:dry --spec .../backend/01-backend-spec.yaml
pnpm openapi:gen --spec .../backend/01-backend-spec.yaml
```
