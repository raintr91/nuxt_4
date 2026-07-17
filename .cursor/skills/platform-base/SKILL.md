---
name: platform-base
description: Nuxt 4 FE conventions — layers, testId, gen-first; see invariants (glob)
disable-model-invocation: true
---

# Platform Base (Nuxt 4 FE)

Auth-first Nuxt 4 · Pinia · vee-validate+Zod · shadcn · Playwright.

**Rules (FE globs):** `platform-invariants.mdc` · `platform-contract-naming.mdc` · `platform-base-*` · size/split/import · design-vocab.

## Gen trước (code)

1. Artifactgraph MCP `gen` / `pnpm portal:gen --id …` từ IR đã grill
2. AI chỉ gap: Mo* / `#needs-*` chưa có trong `registries/`
3. Không viết boilerplate layer nếu gen đã cover

## Layers

`pages/components` → `composables` → `services`+`stores` → `models`+`validations` → `$apiFetch`  
Không `$apiFetch` ở page/component. Form: `useApiForm`.

UI: `ui/` → `Mo*` → `Data*|OrGlobal*` · shell `DataListPage`.

testId: `{module}-{field|action}-input|btn|dialog|alert` · `page.getByTestId()`.

## Checklist

- [ ] 4 tầng · file gọn · testId interactive
- [ ] E2E scripts → `/test` (Playwright); plans YAML sống trên tests hub
