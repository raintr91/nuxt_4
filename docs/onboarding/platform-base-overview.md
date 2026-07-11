# Platform Base Overview

> Page tham khảo cho slide `Portal Feature Artifact Workflow`.

## Mục Tiêu Base

Platform Base giúp team và AI làm nhanh hơn nhưng vẫn giữ pattern.

- Nuxt 4 auth-first portal.
- shadcn-vue primitives.
- Molecules/organisms dùng lại.
- 4 tầng rõ ràng.
- Storybook để review component.
- VitePress để review docs.
- Playwright để E2E.

## Stack Chính

- [Nuxt 4](https://nuxt.com/): framework Vue, routing, SSR/SPA.
- [shadcn-vue](https://www.shadcn-vue.com/): UI primitive, Tailwind token.
- Vitest: unit test logic.
- Playwright: E2E browser automation.
- Storybook: UI catalog/review component.
- VitePress: docs site local cho Markdown.

## Kiến Trúc 4 Tầng

```text
pages/components
  ↓
composables
  ↓
services + stores
  ↓
models + validations
  ↓
$apiFetch
```

Rule quan trọng:

- Page/component không gọi `$apiFetch` trực tiếp.
- Service chịu trách nhiệm API.
- Model giữ API contract/types.
- Validation giữ form schema chặt hơn API.

## UI Tiers

```text
components/ui/          shadcn primitives
components/molecules/   Mo*
components/organisms/   Data*, OrGlobal*
pages/                  orchestration only
```

Lợi ích:

- AI có component sẵn để ráp prototype.
- Dev tránh page all-in-one.
- UI nhất quán hơn.
- E2E dễ gắn `data-testid` theo component.

## Common Helpers

- `$apiFetch` wrapper.
- `models/`: API contract + types.
- `validations/`: form validation schema.
- `useApiForm`: map validation + API error.
- testId helpers.
- Semantic UI E2E helpers.

## Storybook

Storybook dùng để xem component độc lập:

```bash
pnpm storybook
pnpm storybook:build
pnpm storybook:gen
```

Dùng tốt cho:

- default/loading/error/disabled state
- molecules/organisms preview
- review UI trước khi vào page thật

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

Platform Base là “đường ray” để AI chạy đúng hướng: có component, rule, tầng kiến trúc và test helper rõ ràng.
