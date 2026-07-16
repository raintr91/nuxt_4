---
name: platform-base
description: Next.js FE conventions — layers, testId, gen-first; see invariants (glob)
disable-model-invocation: true
---

# Platform Base (Next.js FE)

Auth-first Next.js · App Router · shadcn · Playwright. Code under `src/`.

**Rules (FE globs):** `platform-invariants.mdc` · contract-naming · `platform-base-*` · size/split/import · design-vocab.

## Gen trước (code)

1. Artifactgraph MCP `gen` / `pnpm portal:gen --id …` từ IR đã grill
2. AI chỉ gap: Mo* / `#needs-*` chưa registry
3. Không boilerplate nếu gen đã cover

## Layers

`app|pages/components` → hooks/composables → services → models/validations → `apiFetch`  
Form + contract theo stack repo. testId + Playwright: `/test`.

## Checklist

- [ ] Layer sạch · testId interactive
- [ ] E2E scripts → `/test`; plans YAML trên tests hub
