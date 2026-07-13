# OpenAPI codegen (`openapi-gen`)

Generate `backend/02-openapi.yaml` from `01-backend-spec.yaml`.

```bash
pnpm openapi:gen:dry --spec docs/features/yaml/.../backend/01-backend-spec.yaml
pnpm openapi:gen --spec ...
```

Runtime Swagger UI vẫn có tại `http://localhost:4000/api/docs` (`@nestjs/swagger`).

Workflow: `/api-spec` → `openapi:gen` → `pnpm docs:render`.
