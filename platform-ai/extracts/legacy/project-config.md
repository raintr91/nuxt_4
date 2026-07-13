# Legacy & Team Project Config

**Shared SSOT (Cursor + Kilo + any agent):** repo root — see [PROJECT-MAPS](../../../docs/operational/PROJECT-MAPS.md).

Resolve paths from the **first existing** file (do not guess):

```text
{workspace}/team-projects.local.json
{workspace}/team-projects.json
{workspace}/team-projects.example.json

{workspace}/legacy-projects.local.json
{workspace}/legacy-projects.json
{workspace}/legacy-projects.example.json
```

Optional personal override (outside repo): `~/.cursor/team-projects.json` · `~/.cursor/legacy-projects.json`

Templates (committed): `team-projects.example.json` · `legacy-projects.example.json`  
Live maps (committed): `team-projects.json` · `legacy-projects.json`  
Local overrides (gitignored): `*.local.json`

- If no config exists, state that cross-repo legacy/FE↔BE alignment cannot be verified.
- If multiple projects match and none is default, ask which one to use.
- Preserve schema keys, route paths, API fields, model names, code identifiers, and `data-testid` in docs/spec/testcase/handoff.
- Factory AI group: `factory-ai-stack` → `portal` · `fast-api-base` · `line` · `integration`.

Output language: Vietnamese for docs/spec/testcase/handoff text; keep technical keys in English.
