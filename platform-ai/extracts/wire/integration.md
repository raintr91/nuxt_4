## Wire integration checklist

1. Confirm `@portal/models` matches Nest DTOs (`contract:gen` + `/grill-api`).
2. `src/services/*` — `apiFetch` only (`@/lib/api-client`).
3. `src/hooks/*` — call services; drop production mocks.
4. `src/mocks/*` — prototype only; remove or gate on env at wire.
5. `app/` + `components/` — bind hooks; no direct HTTP.

Env: `NEXT_PUBLIC_API_URL` → Nest (`pnpm dev:api` :4000).

Lifecycle: `pnpm portal:lifecycle set /route wire`
