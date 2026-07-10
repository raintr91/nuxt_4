# fast-gen HANDOFF — SampleItem

- Spec: `/home/vutv/workspace/portal/docs/features/yaml/_example/contract-pilot/backend/01-backend-spec.yaml`
- Module: `Example` / entity `SampleItem`
- Route prefix: `/sample-items`

## Verify

```bash
cd ~/workspace/fast-api-base
PYTHONPATH=tools:src .venv/bin/pytest -q
PYTHONPATH=tools:src .venv/bin/uvicorn app.main:app --port 4000 --app-dir src
```
