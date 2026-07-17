# Portal unit test tags

> **Doc chính:** `base-docs/platform/toolchain/PORTAL-CODEGEN.md` — `portal:gen` + `portal:unit-gen`.  
> **Diagram:** `base-docs/platform/toolchain/UNIT-PHASE-DIAGRAM.md`

Source: `pnpm portal:unit-gen --id W-…` (IR trên **base-docs** Code)  
Registry: `registries/unit-test.registry.json` — `pnpm portal:unit-registry`  
Manifest / HANDOFF: `base-docs/…/code/{W-…}/generated/`

**Separate** from design registry and from `codegen.manifest.json`.

## Who adds what

| Phase | Adds |
|-------|------|
| Docs grill | Optional `#gen:test-*` on hub IR |
| `portal:unit-gen` | `unit.manifest.json`, `UNIT-HANDOFF.md`, `#needs-unit-test:*` |
| `/unit` | Implement gaps; promote registry |

## Commands

```bash
pnpm portal:unit-registry
pnpm portal:unit-gen:dry --id W-AD-AUTH-001
pnpm portal:unit-gen --id W-AD-AUTH-001
pnpm portal:unit-gen --id W-AD-AUTH-001 --write-spec-tags
pnpm exec vitest run tests/unit/...
```

## After generate

1. Read `…/generated/UNIT-HANDOFF.md` on hub Code
2. Run scoped vitest
3. `/unit` only for `needsUnit[]`
4. Promote — `base-docs/platform/toolchain/UNIT-REGISTRY-PROMOTION.md`
