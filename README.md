# Portal Base (Next.js 15)

Auth-first Next.js — shadcn dashboard, kiến trúc 4 tầng trong `src/`, harness AI (code lane).  
Workspace còn `packages/models` (`@portal/models`).

## Quick start

```bash
pnpm install
pnpm dev
```

FE tại root (mặc định port 3000).

## Commands

| Command | Mô tả |
|---------|--------|
| `pnpm dev` | Next dev |
| `pnpm build` | Production build |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright |
| `pnpm portal:gen --id <W-…\|CMP-…>` | FE codegen |
| `pnpm testcase:gen --id <W-…\|TC-…>` | Gen Playwright từ tests hub |

## Repo này

Skeleton: `/login`, `/` (protected dashboard), middleware cookie `auth_token`.  
API client: `src/lib/api-client.ts` → `NEXT_PUBLIC_API_URL/api/*`.

Codegen / registries: `codegen/`, `registries/`, `unitgen/`, `testgen/`.

## AI harness (code lane)

Skills: `.cursor/skills/` · rules/extracts: `.cursor/`.  
SSOT harness = `.cursor/` tại repo này.
