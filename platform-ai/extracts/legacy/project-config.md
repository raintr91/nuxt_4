# Legacy & Team Project Config

Resolve paths from the first available file (do not guess):

```text
~/.cursor/team-projects.json
{workspace}/.kilo/config/team-projects.json
~/.cursor/legacy-projects.json
{workspace}/.kilo/config/legacy-projects.json
```

- If no config exists, state that cross-repo legacy/FE↔BE alignment cannot be verified.
- If multiple projects match and none is default, ask which one to use.
- Preserve schema keys, route paths, API fields, model names, code identifiers, and `data-testid` in docs/spec/testcase/handoff.

Output language: Vietnamese for docs/spec/testcase/handoff text; keep technical keys in English.
