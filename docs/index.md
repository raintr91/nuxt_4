# Portal Docs

Hai lớp tài liệu feature:

- **YAML** — source of truth (`features/{slug}/`)
- **Markdown generated** — review BA/QA (`features/{slug}/generated/`)

```bash
pnpm docs:render
pnpm docs:dev
```

## Operational

- [Architecture](./operational/ARCHITECTURE.md) — FE `src/` + `@portal/models` + fast-api-base
- [Project maps](./operational/PROJECT-MAPS.md) — root `team-projects` / `legacy-projects` (Cursor + Kilo)
- [Full cycle (overview)](./operational/FULL-CYCLE-PIPELINE-DIAGRAM.md) — phase map (Design · Scaffold · API · Wire)
- [Feature artifact flows](./operational/FEATURE-ARTIFACT-FLOWS.md) — index diagram + lệnh (gồm backend + API unit lane)
- [Prompt templates](./operational/PROMPT-TEMPLATES.md)
- [E2E Test IDs](./operational/E2E-TESTIDS.md)
- [Semantic UI Assertions](./operational/E2E-SEMANTIC-UI-ASSERTIONS.md)

Backend/API chi tiết: đi từ [FEATURE-ARTIFACT-FLOWS](./operational/FEATURE-ARTIFACT-FLOWS.md) → [BACKEND-CODEGEN](./operational/BACKEND-CODEGEN.md) · [BACKEND-PHASE-DIAGRAM](./operational/BACKEND-PHASE-DIAGRAM.md).

## Onboarding (slides)

- [Feature Artifact Workflow Slides](./onboarding/team-ai-workflow-slides.md) — training; giữ `/design`
- [YAML/Markdown workflow](./onboarding/yaml-markdown-ai-workflow.md)
- [Portal Base overview](./onboarding/portal-base-overview.md)
- [E2E automation (QA)](./onboarding/e2e-automation-playwright.md)

## Common UI

- [Common UI patterns](./common-ui/index.md)
- [Generated feature docs](./common-ui/generated.md) → `features/common/`, `features/hotel/`, …

## Dev environment

- [Docker dev nhẹ](./dev-environment/DOCKER-DEV-LIGHT.md)
- [WSL + Cursor perf](./dev-environment/WSL-CURSOR-PERF.md)
- [Monorepo strategy](./dev-environment/MONOREPO-STRATEGY.md)

Backend: in-repo — [BACKEND-CODEGEN](./operational/BACKEND-CODEGEN.md) (thay `api/` repo cũ)
