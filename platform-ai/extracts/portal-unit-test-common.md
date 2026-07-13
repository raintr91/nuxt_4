# Portal unit test — common patterns

| Layer | Output path |
|-------|-------------|
| schema | `tests/unit/models/{entity}/*.test.ts` |
| service | `tests/unit/services/{entity}.*.test.ts` |
| hook | `tests/unit/hooks/{entity}/use{Entity}List.test.ts` |
| validation | `tests/unit/validations/{entity}/schemas.test.ts` |

## Mock boundaries

- Mock `apiFetch` / service at boundary — not Zustand internals
- Hook tests: `@testing-library/react` `renderHook` when generated
