---
name: grill-prototype
extractBundle: grill-prototype
description: /grill-prototype — gate prototype before wire/test.
disable-model-invocation: true
---

# /grill-prototype — Prototype audit

Dùng sau `/prototype`, trước demo / `/test` / `/wire`.

**Extracts:** `extractBundle: grill-prototype` → `.cursor/extracts/extract-registry.json`

Checklist chi tiết: `.cursor/skills/prototype/SKILL.md`.

## Load policy

| Load | Do not load |
|------|-------------|
| Hub `…/code/{W-…}/ir/spec.yaml` — routes, `ui.testIds`, `api.endpoints` | Legacy source, trace |
| Cùng folder `*.bundle.yaml` — tags, `grillStatus` (nếu cần) | Function khác |
| `…/code/{W-…}/generated/HANDOFF.md` | Handbook VitePress |
| Prototype pages — `data-testid` trên route | Playwright / Vitest specs |
| | `base-tests` plans (đó là `/test` / `/testcase`) |

## Prototype fit

- Happy path, validation, loading/empty/error khi có trong spec
- Mock pagination ≥2 pages khi list
- Auth bypass trên prototype routes; không gọi backend thật
- Shell registry (`DataListPage` / …) khớp tags

## Common / component audit

0. Ưu tiên MCP `gaps` / `grill_check` (local) — bảng cho member; **không cloud** “còn thiếu gì”.
1. Đọc `generated/HANDOFF.md` — mọi `#needs-component` / `#needs-ui` resolved hoặc `openQuestions`
2. Mo* trên disk khớp `tags:` / slot
3. Mo* reuse ≥2 features → `/platform-mark` promote
4. `#needs-common` / `#common:` — logic shared trên FE
5. Gaps → bảng (VI):

| Item | spec tag | on disk | action |
|------|----------|---------|--------|
| `MoStatusChip` | `#needs-component: cell-status:…` | yes/no | fix prototype · `/platform-mark` |

## testIds (`ir/spec.yaml` ↔ UI)

1. Đọc hub `ir/spec.yaml` → `ui.testIds.required` / `patterns`.
2. **Required:** mỗi id có `data-testid` trên route prototype.
3. **Patterns:** với mock row, ít nhất một id khớp template.
4. Ghi bảng gap trong handoff; **block** `/test` nếu required còn thiếu.

**Không** chạy full Playwright / Vitest trong command này.

## E2E handoff (cho `/test`)

1. **Route** · lifecycle · auth bypass
2. **Spec:** `base-docs/…/code/{W-…}/ir/spec.yaml` (`--id`)
3. **Plans:** `base-tests/cases/…` / `TC-*` (không còn `docs/features/…/*.test.yaml`)
4. **testIds.required** — all pass / list gaps
5. **Session / mocks** vs `api.endpoints` trong ir/spec
6. **`#wire-only`** — defer `/wire`
7. **Open issues**

## Out of scope

- So sánh legacy (docs lane)
- Viết Playwright (`/test`) · author TC trên hub (`/testcase` trên base-tests)
- Unit tests (`/unit`)

## Handoff targets

- Fix trong prototype → apply
- Ready E2E → `/test`
- API contract → BE `/api` rồi `/wire`
