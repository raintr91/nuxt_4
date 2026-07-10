# Portal Base Overview

> Page tham khảo cho slide `Portal Feature Artifact Workflow`.

## Mục Tiêu Base

Portal Base giúp team và AI làm nhanh hơn nhưng vẫn giữ pattern.

- Next.js 15 auth-first portal (`src`).
- shadcn/ui primitives.
- Molecules/organisms dùng lại.
- 4 tầng rõ ràng.
- VitePress để review docs.
- Playwright để E2E.

## Stack Chính

- [Next.js 15](https://nextjs.org/): React App Router, SSR/SPA.
- [shadcn/ui](https://ui.shadcn.com/): UI primitive, Tailwind token.
- Vitest: unit test logic.
- Playwright: E2E browser automation.
- VitePress: docs site local cho Markdown.

## Kiến Trúc 4 Tầng

```text
app/ + components/
  ↓
hooks/
  ↓
services + stores
  ↓
models + validations
  ↓
apiFetch
```

Rule quan trọng:

- Page/component không gọi `apiFetch` trực tiếp.
- Service chịu trách nhiệm API.
- Model giữ API contract/types.
- Validation giữ form schema chặt hơn API.

## UI Tiers

```text
src/components/ui/          shadcn primitives
src/components/molecules/   mo-*
src/components/organisms/   data-*
src/app/(dashboard)/        orchestration only
```

Lợi ích:

- AI có component sẵn để ráp prototype.
- Dev tránh page all-in-one.
- UI nhất quán hơn.
- E2E dễ gắn `data-testid` theo component.

## Common Helpers

- `apiFetch` wrapper (`src/lib/api-client.ts`).
- `@portal/models`: API contract + types.
- `validations/`: form validation schema.
- `react-hook-form` + zod resolver.
- testId helpers.
- Semantic UI E2E helpers.

## VitePress Docs

Member non-tech không cần đọc YAML.

Luồng review:

- AI/dev dùng YAML làm lớp kỹ thuật.
- BA/QA/member review Markdown.
- Markdown được render bằng script, không cần AI.
- VitePress giúp đọc đẹp, có link, có search.

```bash
pnpm docs:render
pnpm docs:dev
pnpm docs:build
```

VitePress giúp:

- render Markdown đẹp
- có sidebar/search/link
- BA/QA đọc dễ hơn YAML
- docs build được trong CI

## Local Prototype

Dev chạy:

```bash
pnpm install
pnpm dev
```

Mục tiêu: BA/QA xem mock UI trên host, không cần Docker/domain.

## Câu Chốt

Portal Base là “đường ray” để AI chạy đúng hướng: có component, rule, tầng kiến trúc và test helper rõ ràng.
