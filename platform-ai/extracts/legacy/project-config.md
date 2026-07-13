# Platform & Legacy repo config

Resolve paths from the first available file (do not guess):

```text
{workspace}/platform-repos.local.json
{workspace}/platform-repos.json
{workspace}/platform-repos.example.json
~/.cursor/platform-repos.json

{workspace}/legacy-repos.local.json
{workspace}/legacy-repos.json
{workspace}/legacy-repos.example.json
~/.cursor/legacy-repos.json
```

Hub: `docs/operational/PROJECT-MAPS.md`

- If no config exists, state that cross-repo legacy/FE↔BE alignment cannot be verified.
- If multiple projects match and none is default, ask which one to use.
- Preserve schema keys, route paths, API fields, model names, code identifiers, and `data-testid` in docs/spec/testcase/handoff.

**Deprecated names** (do not use): `team-projects.json`, `legacy-projects.json`, `.cursor/*-projects*`, `.kilo/config/*-projects*`.

Output language: Vietnamese for docs/spec/testcase/handoff text; keep technical keys in English.
