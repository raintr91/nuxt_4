# Portal E2E gen readiness (FE `/test`)

**Who:** `/test`, `/grill-test`  
**Plans authoring:** `base-tests` `/testcase` · template `base-tests/templates/testcase.yaml` — not this extract.

Prerequisite: `/prototype` done · plan YAML exists on **base-tests**.

## Inputs

| Source | Purpose |
|--------|---------|
| `base-tests/cases/**/TC-*.yaml` via `--id` | Steps / assertions / testIds |
| Design `ui.testIds` on base-docs | Align ids after gen |
| Prototype UI | visible testids |

## Gate

1. [ ] Hub case registered in `base-tests/registries/tests-index.json`
2. [ ] `pnpm testcase:gen:dry --id …` OK
3. [ ] Session helpers exist when plan needs them
4. [ ] Do **not** edit plan YAML in FE session — handoff tests hub
