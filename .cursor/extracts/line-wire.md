## Line wire checklist

1. Start fast: `uvicorn app.main:app --port 4000` in `~/workspace/fast-api-base`.
2. `FastApi:UseMock=false` · `FastApi:BaseUrl=http://127.0.0.1:4000/api`.
3. `dotnet run --project src/Line.App` — check-in flow.
4. `./scripts/smoke-wire.sh` — curl envelope OK.
5. `./scripts/contract-sync --openapi <portal>/backend/02-openapi.yaml`.

Audit: `/grill-line-api` · `/line-unit`.
