# Portal unit test workflow

| Layer | Generated test |
|-------|----------------|
| schema | `tests/unit/models/{entity}/*.test.ts` |
| service | `tests/unit/services/{entity}.*.test.ts` |
| hook | `tests/unit/hooks/{entity}/use*List.test.ts` |
| validation | `tests/unit/validations/{entity}/schemas.test.ts` |

Mock boundary: `tests/unit/_helpers/mockApiFetch.ts` · hook tests use `renderHook` when generated.
