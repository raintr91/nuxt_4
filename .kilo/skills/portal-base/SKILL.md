---
description: Next.js app conventions — layers, testId, E2E; see invariants + ARCHITECTURE.md
disable-model-invocation: true
---

# Portal Base (Next.js 15)

Auth-first Next.js · React 19 · Zustand · react-hook-form+Zod · shadcn/ui · Playwright.

**Rules:** `portal-invariants.mdc`, `portal-contract-naming.mdc`, glob `portal-base-*`, `portal-code-size`, `portal-component-split`.

**Docs:** `docs/operational/ARCHITECTURE.md`, `E2E-TESTIDS.md` · **E2E skill:** `test/SKILL.md`

**Legacy / team paths (shared Cursor + Kilo):** root `team-projects.json` · `legacy-projects.json` — never guess. Templates: `*.example.json`. See `docs/operational/PROJECT-MAPS.md`.

## Layers

`app/` + `components/` → `hooks/` → `services/` + `stores/` → `validations/` + `@portal/models` → `apiFetch`

| Tầng | Không làm |
|------|-----------|
| page/component | `apiFetch` |
| hook | HTTP chi tiết |
| service | Zustand state |
| models | import stores/services/hooks |

**New feature order:** models → service → store? → hook → validations? → page + testId

**Form:** `react-hook-form` + `validations/` (chặt) + `@portal/models` (API contract).

## UI tiers

`components/ui/` → `molecules/mo-*` → `organisms/data-*` · list shell: `DataListPage` · dashboard: `app/(dashboard)/layout.tsx`

## testId (summary)

`{module}-{field|action}-input|btn|dialog|alert` · auth: `auth-login-*` · `page.getByTestId()` · no `#id`/class selectors.

**Detail:** [reference.md](reference.md) · `E2E-TESTIDS.md`

## E2E

```bash
pnpm test:e2e    # Next dev port 3005 + Playwright
```

After `goto`: `assertLayoutIntegrity(page)` · specs `tests/e2e/**/*.spec.ts`

## Agent checklist

- [ ] 4 layers respected · file ~≤200 lines · testId on interactives
- [ ] `/test` for full E2E — `/prototype` only smoke skeleton if needed
