## Line prototype checklist

1. Portal `ir/spec.yaml` has `clients.line` block (screens, automationIds, API paths).
2. `pnpm contract:gen --spec .../ir/spec.yaml` — `@portal/models` workforce keys.
3. `~/workspace/line/scripts/line-gen write --spec .../ir/spec.yaml` — Generated VM/Service.
4. `FastApi:UseMock=true` — kiosk runs without fast.
5. xUnit: `dotnet test tests/Line.App.Tests`.

Next: `/line-wire` · audit `/grill-line-api`.
