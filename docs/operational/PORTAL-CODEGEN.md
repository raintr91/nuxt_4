# Portal codegen — `portal:gen` + `portal:unit-gen`

> **R2/R3:** Product Code + architecture → [`base-docs`](https://github.com/raintr91/base_docs) · E2E plans → [`base-tests`](https://github.com/raintr91/base_test) · gen: `pnpm portal:gen --id …` / `pnpm testcase:gen --id …` · [Hub split](https://github.com/raintr91/base_test/blob/main/docs/HUBS.md) / [Docs hub](https://github.com/raintr91/base_docs) / [Tests hub](https://github.com/raintr91/base_test/blob/main/docs/TESTS-HUB.md)


> **Doc chính (đọc file này trước).** Layout: [CODEGEN-LAYOUT](https://github.com/raintr91/codegenkit/blob/main/docs/CODEGEN-LAYOUT.md) · Lệnh: [FEATURE-ARTIFACT-COMMANDS](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/FEATURE-ARTIFACT-COMMANDS.md) · Flow: [FEATURE-ARTIFACT-FLOWS](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/FEATURE-ARTIFACT-FLOWS.md).
> Chi tiết tag: `.cursor/extracts/codegen/tags.md` (docs hub) · unit/design tag tables live in the FE checkout.
> **Dev lane Vitest:** [UNIT-PHASE-DIAGRAM](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/UNIT-PHASE-DIAGRAM.md) · **E2E lane:** [TEST-PHASE-DIAGRAM](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/TEST-PHASE-DIAGRAM.md)

Hai pipeline app + unit **tách script**, **tách registry** — E2E `testcase:gen` pipeline thứ ba (Playwright only):

| Pipeline | Lệnh | Registry | Output app / test |
|----------|------|----------|-------------------|
| **App scaffold** | `pnpm portal:gen` | `registries/design.registry.json` | `models/`, `services/`, `pages/`, `mocks/`, … |
| **Unit tests** | `pnpm portal:unit-gen` | `registries/unit-test.registry.json` | `tests/unit/…` (một file / layer) |
| **E2E tests** | `pnpm testcase:gen` | `registries/e2e-test.registry.json` | `tests/e2e/…` + Page Objects |

---

## Thứ tự chạy (feature mới)

```text
/dev-grill-docs  →  base-docs Code …/ir/spec.yaml
       ↓
pnpm portal:gen:dry --id W-AD-AUTH-001
pnpm portal:gen --id W-AD-AUTH-001
       ↓
/prototype  →  implement Mo* / gap từ HANDOFF
       ↓
pnpm portal:unit-gen --id W-AD-AUTH-001   # khi unit-gen hỗ trợ --id; else --spec path
       ↓
/test: pnpm testcase:gen --id W-AD-AUTH-001 → /grill-test
       ↓
/wire
```

## Lệnh nhanh

### App — `portal:gen`

```bash
pnpm portal:registry
pnpm portal:gen:dry --id W-AD-AUTH-001
pnpm portal:gen --id W-AD-AUTH-001
pnpm portal:gen --id W-AD-AUTH-001 --force
pnpm portal:lifecycle sync
```

### Unit — `portal:unit-gen`

```bash
pnpm portal:unit-registry               # validate unit-test registry
pnpm portal:unit-gen:dry --id W-AD-AUTH-001
pnpm portal:unit-gen --id W-AD-AUTH-001
pnpm portal:unit-gen --id <W-…> --force
pnpm exec vitest run tests/unit/models/chain-hotel/chain-hotel.schema.test.ts
```

### E2E — `testcase:gen`

```bash
pnpm portal:e2e-registry
pnpm testcase:gen:dry --id TC-LOGIN-VALID
pnpm testcase:gen --id W-AD-AUTH-001
pnpm testcase:gen --id smoke
pnpm test:e2e tests/e2e/...
```

---

## `portal:gen` — app scaffold

**Input:** ``base-docs` Code `…/code/W-*/ir/spec.yaml` (or `pnpm portal:gen --id`)` với `codegen.profile`, `ui.*`, `api.endpoints`, `tags`.

**Template:** `codegen/templates/` (Handlebars).

**Output mỗi feature:**

| Artifact | Path |
|----------|------|
| App layers | `models/`, `services/`, `composables/`, `pages/`, `mocks/`, `validations/` (create) |
| Manifest | ``base-docs` Code `…/code/W-*/generated/` (handoff) + app layers in FE repocodegen.manifest.json` |
| Handoff prototype | ``base-docs` Code `…/code/W-*/generated/` (handoff) + app layers in FE repoHANDOFF.md` |

**Profiles:** `list` · `create` (sau này `edit` / `detail`).

**UI registry:** `#shell: DataListPage`, `#needs-component:…`, `#wire-only:…` — xem [DESIGN-REGISTRY-PROMOTION](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/DESIGN-REGISTRY-PROMOTION.md), [NEEDS-COMPONENT-FLOW](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/NEEDS-COMPONENT-FLOW.md).

**Lifecycle:** ghi `pages/*.vue` → cập nhật stage `prototype` — [PAGE-LIFECYCLE](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/PAGE-LIFECYCLE.md).

**Không gen:** component `Mo*` (prototype implement); unit test (pipeline riêng).

---

## `portal:unit-gen` — Vitest skeleton

**Phạm vi:** chỉ Portal FE. `api:unit-gen` (repo `api/`) **để sau** — xem [PORTAL-UNIT-GEN-ROADMAP](./PORTAL-UNIT-GEN-ROADMAP.md) mục Deferred.

**Prerequisite:** đã `portal:gen` + `codegen.manifest.json` + file model trên disk.

**Template:** `unitgen/templates/` — **một pattern = một file test**.

**Output mỗi feature:**

| Artifact | Path |
|----------|------|
| Schema test (v1) | `tests/unit/models/{entity}/{entity}.schema.test.ts` |
| Service list test (v2) | `tests/unit/services/{entity}.service.test.ts` |
| Manifest | ``base-docs` Code `…/code/W-*/generated/` (handoff) + app layers in FE repounit.manifest.json` |
| Handoff unit | ``base-docs` Code `…/code/W-*/generated/` (handoff) + app layers in FE repoUNIT-HANDOFF.md` |

**Helper chung:** `tests/unit/_helpers/mockApiFetch.ts` (`#test-mock:api-fetch` — service tests PR2+).

**Learning loop** (giống `#needs-component`):

1. Pattern `planned` trong `portal-unit-test.registry.json` → gen ghi `#needs-unit-test:*` vào UNIT-HANDOFF.
2. `/unit` hoặc dev implement test tay.
3. Promote pattern → `implemented` trong registry → feature sau auto-gen.

Patterns **planned** (chưa gen): validation, composable, export — xem registry.

**Roadmap PR0→PR13:** [PORTAL-UNIT-GEN-ROADMAP](./PORTAL-UNIT-GEN-ROADMAP.md) (unit PR0–11; E2E PR12–13 trong cùng hub).

---

## `testcase:gen` — Playwright skeleton (PR12–13)

**Phạm vi:** E2E từ ``base-docs` + `base-tests`/testcases/*.yaml` — **không** gộp `portal:unit-gen`.

**Prerequisite:** prototype + `ui.testIds` trên page; session/mock registry trong `tests/e2e/helpers/`.

**Registry semantic/axe (PR13a):** `registries/e2e-test.registry.json` — hashtag `#e2e:semantic-smoke`, `#e2e:a11y-wcag`, …

**Output mỗi testcase:**

| Artifact | Path |
|----------|------|
| Page Object | `tests/e2e/pages/{module}/{Page}.ts` |
| Spec | `tests/e2e/{module}/{testcase-id}.spec.ts` |

**Diagram:** [TEST-PHASE-DIAGRAM](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/TEST-PHASE-DIAGRAM.md) · **Matcher design:** [E2E-SEMANTIC-UI-ASSERTIONS](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/E2E-SEMANTIC-UI-ASSERTIONS.md)

---

## Hai registry — không trộn

| | UI / code | Unit test |
|--|-----------|-----------|
| File | `registries/design.registry.json` | `registries/unit-test.registry.json` |
| Validate | `pnpm portal:registry` | `pnpm portal:unit-registry` |
| Promote doc | [DESIGN-REGISTRY-PROMOTION](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/DESIGN-REGISTRY-PROMOTION.md) | [UNIT-REGISTRY-PROMOTION](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/UNIT-REGISTRY-PROMOTION.md) |
| Tag ví dụ | `#shell: DataListPage`, `#needs-component:` | `#gen:test-schema`, `#needs-unit-test:` |

**E2E** (pipeline riêng): `registries/e2e-test.registry.json` · `#e2e:semantic-*`, `#e2e:a11y-*` · [TEST-PHASE-DIAGRAM](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/TEST-PHASE-DIAGRAM.md)

---

## Tag tham chiếu {#tag-tham-chieu}

### Codegen (`portal:gen`)

| Tag | Ý nghĩa |
|-----|---------|
| `#shell: DataListPage` | List shell mặc định |
| `#needs-component: cell-x:MoXxx:prop` | Thiếu molecule — prototype rồi re-gen |
| `#manual-composable: name` | Composable thủ công — HANDOFF |
| `#skip-codegen: layer` | Bỏ qua layer khi gen |
| `#wire-only: topic` | Defer đến `/wire` |

### Unit (`portal:unit-gen`)

| Tag | Ý nghĩa |
|-----|---------|
| `#gen:test-schema` | Bắt buộc gen schema test |
| `#gen:test-service` | Bắt buộc gen service test (list) |
| `#skip-unit-test: models` | Không gen schema test |
| `#needs-unit-test: layer:target` | Chưa auto-gen — xem UNIT-HANDOFF |
| `#test-mock:api-fetch` | Service unit mock boundary |

### E2E (`testcase:gen`)

| Tag | Ý nghĩa |
|-----|---------|
| `#e2e:semantic-smoke` | Level 1: console, scroll, broken images |
| `#e2e:semantic-list` | List layout smoke + table/overlap |
| `#e2e:a11y-wcag` | Axe WCAG scan scoped `rootTestId` |
| `#skip-e2e-assert:{matcher}` | Bỏ một matcher khỏi union |

Chi tiết: `.cursor/extracts/codegen/tags.md` · FE unit tags live in the FE checkout.

---

## Spec & template mẫu

- Feature spec: `docs/templates/spec.yaml`
- Testcase (E2E, không unit-gen): `docs/templates/testcase.yaml`
- Readiness grill: `.cursor/extracts/codegen/readiness.md`

---

## Workflow team

- Pipeline tổng: [FEATURE-ARTIFACT-FLOWS](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/FEATURE-ARTIFACT-FLOWS.md) · [FULL-CYCLE-PIPELINE-DIAGRAM](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/FULL-CYCLE-PIPELINE-DIAGRAM.md)
- **Dev lane unit:** [UNIT-PHASE-DIAGRAM](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/UNIT-PHASE-DIAGRAM.md) · `.cursor/skills/unit/SKILL.md` · `.cursor/skills/grill-unit/SKILL.md`
- **E2E lane:** [TEST-PHASE-DIAGRAM](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/TEST-PHASE-DIAGRAM.md) · `.cursor/skills/test/SKILL.md` · `.cursor/skills/grill-test/SKILL.md`
- Phase prototype: `.cursor/skills/prototype/SKILL.md`
- Render docs review: `pnpm docs:render` → ``base-docs` + `base-tests`/generated/*.md`

---

## Ví dụ end-to-end (chain hotel list)

```bash
# Sau grill + portal:gen
pnpm portal:gen --id W-AD-AUTH-001

# Unit schema (auto — pattern implemented)
pnpm portal:unit-gen --id W-AD-AUTH-001
pnpm exec vitest run tests/unit/models/chain-hotel/chain-hotel.schema.test.ts

# Đọc gap
cat base-docs Product Code /  chain/hotel/generated/UNIT-HANDOFF.md

# E2E (sau /test)
pnpm testcase:gen --id <W-|TC-|suite> --force
pnpm test:e2e tests/e2e/chain-hotels/
```
