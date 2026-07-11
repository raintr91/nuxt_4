# Portal Docs

Hai lớp tài liệu feature:

- **YAML** — source of truth (`features/{slug}/`)
- **Markdown generated** — review BA/QA (`features/{slug}/generated/`)

```bash
pnpm docs:render
pnpm docs:dev
```

## Operational

- [platform-ai/README.md](../platform-ai/README.md) — SSOT skills/rules · `./scripts/platform-ai-link`
- [Architecture](./operational/ARCHITECTURE.md)
- [Full cycle (overview)](./operational/FULL-CYCLE-PIPELINE-DIAGRAM.md)
- [Feature artifact flows](./operational/FEATURE-ARTIFACT-FLOWS.md)
- [Prompt templates](./operational/PROMPT-TEMPLATES.md)
- [E2E Test IDs](./operational/E2E-TESTIDS.md)
- [Semantic UI Assertions](./operational/E2E-SEMANTIC-UI-ASSERTIONS.md)

## Onboarding (slides)

- [Feature Artifact Workflow Slides](./onboarding/team-ai-workflow-slides.md) — training; giữ `/design`
- [YAML/Markdown workflow](./onboarding/yaml-markdown-ai-workflow.md)
- [Platform Base overview](./onboarding/platform-base-overview.md)
- [E2E automation (QA)](./onboarding/e2e-automation-playwright.md)

## Common UI

- [Common UI patterns](./common-ui/index.md)
- [Generated feature docs](./common-ui/generated.md) → `features/common/`, `features/hotel/`, …

## Dev environment

- [Docker dev nhẹ](./dev-environment/DOCKER-DEV-LIGHT.md)
- [WSL + Cursor perf](./dev-environment/WSL-CURSOR-PERF.md)
- [Monorepo strategy](./dev-environment/MONOREPO-STRATEGY.md)

Backend: repo `api/` → `src/docs/TEAM-AI-BACKEND-WORKFLOW.md`
