# Wire — Portal API integration

**Who uses:** `/wire` · after `/api` or when prototype mocks are ready to swap

## Artifact inputs

| Source | Purpose |
|--------|---------|
| `docs/features/yaml/.../{function}/ir/spec.yaml` | `api.endpoints`, contract keys, routes |
| `docs/features/yaml/.../{function}/*.bundle.yaml` | `#update:*`, `specRevision`, `featureStatus` |
| `docs/features/yaml/.../{function}/*.test.yaml` | E2E expectations post-wire |
| Backend handoff (`/api`) | Real payloads, validation errors, permissions |

**Do not** re-mine legacy during wire unless tagged `#legacy-recheck`.

## Integration order (4 tầng)

1. `models/` — align types/schemas with real API
2. `services/*` — `$apiFetch` only
3. `composables/` — call services; drop production mocks
4. `validations/` — when form API errors require it
5. `pages/` / `components/` — bind composables
6. Remove mock imports from production paths (keep test mocks)

## Lifecycle at wire success

On successful scoped integration:

1. Remove **all** `#update:*` tags from bundle
2. `lastSynced.wire = specRevision`
3. `featureStatus: wire` · `wireCount += 1`
4. If bundle edited → `pnpm spec:split` + `pnpm spec:split:check`
5. Re-run scoped E2E; then `pnpm portal:lifecycle set {route.path} wire`

See `spec-update-tags.md`, `feature-lifecycle-status.md`.

## Verify gate

```bash
pnpm exec vue-tsc --noEmit   # or project typecheck script
pnpm test:e2e tests/e2e/{module}/   # scoped feature path
```

Report exit codes — no “should pass” without a fresh run.

## References

- `docs/operational/WIRE-PHASE-DIAGRAM.md`
- `docs/operational/FEATURE-ARTIFACT-FLOWS.md`
- `.cursor/skills/wire/SKILL.md`
