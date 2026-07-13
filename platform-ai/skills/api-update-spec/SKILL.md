---
name: api-update-spec
extractBundle: api-update-spec
description: /api-update-spec — sync backend/ when ir/spec changes.
disable-model-invocation: true
---

# /api-update-spec

Modes: **portal-sync** (default) · **be-only** (`--be-only`).

Update `backend/01|02|03` in place. No `codegen` / `#gen:*` — grill adds after sync.

Handoff → `/grill-api-spec`.

Reference: `~/workspace/api/.cursor/skills/api-update-spec/SKILL.md` (workflow detail).
