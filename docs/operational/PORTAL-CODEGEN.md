# Portal codegen — `portal:gen` + `portal:unit-gen`

> **Doc chính (đọc file này trước).** Lệnh tra cứu: [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md) · Flow: [FEATURE-ARTIFACT-FLOWS](./FEATURE-ARTIFACT-FLOWS.md).  
> Chi tiết tag: `.cursor/extracts/codegen/tags.md`, `.cursor/extracts/portal-unit-test-tags.md`, …  
> **Dev lane Vitest:** [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md) · **Dev lane Jest (API):** [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md) · **E2E lane:** [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md) · **Backend hub:** [BACKEND-CODEGEN](./BACKEND-CODEGEN.md)

Hai pipeline app + unit **tách script**, **tách registry** — E2E `testcase:gen` pipeline thứ ba (Playwright only):

| Pipeline | Lệnh | Registry | Output app / test |
|----------|------|----------|-------------------|
| **App scaffold** | `pnpm portal:gen` | `registries/design.registry.json` | `src/` (`app/`, `hooks/`, `services/`, `mocks/`, …) |
| **Unit tests** | `pnpm portal:unit-gen` | `registries/unit-test.registry.json` | `tests/unit/…` (một file / layer) |
| **E2E tests** | `pnpm testcase:gen` | `registries/e2e-test.registry.json` | `tests/e2e/…` + Page Objects |

---

## Thứ tự chạy (feature mới)

```text
/dev-grill-docs  →  bundle.gen / ir/spec.yaml
       ↓
pnpm contract:gen --spec …/ir/spec.yaml    # @portal/models — xem BACKEND-CODEGEN.md
       ↓
pnpm portal:gen:dry --spec docs/features/yaml/.../ir/spec.yaml
pnpm portal:gen --spec docs/features/yaml/.../ir/spec.yaml
       ↓
/prototype  →  implement Mo* / gap từ {function}/generated/HANDOFF.md
       ↓
pnpm portal:gen --force          # wire slot khi component đã có
       ↓
pnpm portal:unit-gen --spec …    # smoke — unit.manifest.json + UNIT-HANDOFF.md
       ↓
/dev lane (Vitest, độc lập E2E): /unit → /grill-unit  — [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md)
       ↓
/test (E2E): testcase YAML → testcase:gen → /grill-test  — [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md)
       ↓
/wire  — [WIRE-PHASE-DIAGRAM](./WIRE-PHASE-DIAGRAM.md)
```

**Backend song song:** [BACKEND-PHASE-DIAGRAM](./BACKEND-PHASE-DIAGRAM.md) · `nest:gen` sau `contract:gen` — không thay `portal:gen`.

**Phase wire:** chạy lại `portal:unit-gen --spec … --phase wire` khi có template service (PR2+) — bổ sung test mock API, không đổi schema trừ `--force`.

---

## Lệnh nhanh

### App — `portal:gen`

```bash
pnpm portal:registry                    # validate UI registry
pnpm portal:gen:dry --spec docs/features/yaml/chain/hotel/list/ir/spec.yaml
pnpm portal:gen --spec docs/features/yaml/chain/hotel/list/ir/spec.yaml
pnpm portal:gen --spec … --force        # overwrite file đã gen
pnpm portal:remove --spec …             # xóa feature scaffold
pnpm portal:lifecycle sync              # đồng bộ page registry
```

### Unit — `portal:unit-gen`

```bash
pnpm portal:unit-registry               # validate unit-test registry
pnpm portal:unit-gen:dry --spec docs/features/yaml/chain/hotel/list/ir/spec.yaml
pnpm portal:unit-gen --spec docs/features/yaml/chain/hotel/list/ir/spec.yaml
pnpm portal:unit-gen --spec … --force
pnpm exec vitest run tests/unit/models/chain-hotel/chain-hotel.schema.test.ts
```

### E2E — `testcase:gen`

```bash
pnpm portal:e2e-registry
pnpm testcase:gen:dry --testcase docs/features/yaml/admin/hotel/list/hotel-list.test.yaml
pnpm testcase:gen --feature admin/hotel
pnpm testcase:gen --testcase … --force
pnpm test:e2e tests/e2e/chain-hotels/
```

---

## `portal:gen` — app scaffold

**Input:** `docs/features/yaml/.../{function}/ir/spec.yaml` với `codegen.profile`, `ui.*`, `api.endpoints`, `tags`.

**Template:** `codegen/templates/` (Handlebars).

**Output mỗi feature:**

| Artifact | Path |
|----------|------|
| App layers | `src/` — `app/`, `hooks/`, `services/`, `mocks/`, `validations/` (create) |
| Manifest | `docs/features/yaml/.../{function}/generated/codegen.manifest.json` |
| Handoff prototype | `docs/features/yaml/.../{function}/generated/HANDOFF.md` |

**Profiles:** `list` · `create` (sau này `edit` / `detail`).

**UI registry:** `#shell: DataListPage`, `#needs-component:…`, `#wire-only:…` — xem [DESIGN-REGISTRY-PROMOTION](./DESIGN-REGISTRY-PROMOTION.md), [NEEDS-COMPONENT-FLOW](./NEEDS-COMPONENT-FLOW.md).

**Lifecycle:** ghi `src/app/(dashboard)/**/page.tsx` → cập nhật stage `prototype` — [PAGE-LIFECYCLE](./PAGE-LIFECYCLE.md).

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
| Manifest | `docs/features/yaml/.../{function}/generated/unit.manifest.json` |
| Handoff unit | `docs/features/yaml/.../{function}/generated/UNIT-HANDOFF.md` |

**Helper chung:** `tests/unit/_helpers/mockApiFetch.ts` (`#test-mock:api-fetch` — service tests PR2+).

**Learning loop** (giống `#needs-component`):

1. Pattern `planned` trong `portal-unit-test.registry.json` → gen ghi `#needs-unit-test:*` vào UNIT-HANDOFF.
2. `/unit` hoặc dev implement test tay.
3. Promote pattern → `implemented` trong registry → feature sau auto-gen.

Patterns **planned** (chưa gen): validation, composable, export — xem registry.

**Roadmap PR0→PR13:** [PORTAL-UNIT-GEN-ROADMAP](./PORTAL-UNIT-GEN-ROADMAP.md) (unit PR0–11; E2E PR12–13 trong cùng hub).

---

## `testcase:gen` — Playwright skeleton (PR12–13)

**Phạm vi:** E2E từ `docs/features/**/testcases/*.yaml` — **không** gộp `portal:unit-gen`.

**Prerequisite:** prototype + `ui.testIds` trên page; session/mock registry trong `tests/e2e/helpers/`.

**Registry semantic/axe (PR13a):** `registries/e2e-test.registry.json` — hashtag `#e2e:semantic-smoke`, `#e2e:a11y-wcag`, …

**Output mỗi testcase:**

| Artifact | Path |
|----------|------|
| Page Object | `tests/e2e/pages/{module}/{Page}.ts` |
| Spec | `tests/e2e/{module}/{testcase-id}.spec.ts` |

**Diagram:** [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md) · **Matcher design:** [E2E-SEMANTIC-UI-ASSERTIONS](./E2E-SEMANTIC-UI-ASSERTIONS.md)

---

## Hai registry — không trộn

| | UI / code | Unit test |
|--|-----------|-----------|
| File | `registries/design.registry.json` | `registries/unit-test.registry.json` |
| Validate | `pnpm portal:registry` | `pnpm portal:unit-registry` |
| Promote doc | [DESIGN-REGISTRY-PROMOTION](./DESIGN-REGISTRY-PROMOTION.md) | [UNIT-REGISTRY-PROMOTION](./UNIT-REGISTRY-PROMOTION.md) |
| Tag ví dụ | `#shell: DataListPage`, `#needs-component:` | `#gen:test-schema`, `#needs-unit-test:` |

**E2E** (pipeline riêng): `registries/e2e-test.registry.json` · `#e2e:semantic-*`, `#e2e:a11y-*` · [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md)

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

Chi tiết: `.cursor/extracts/portal-e2e-semantic-tags.md` · tag đầy đủ: [bảng tag tham chiếu](#tag-tham-chieu) · `.cursor/extracts/codegen/tags.md`, `.cursor/extracts/portal-unit-test-tags.md`

---

## Spec & template mẫu

- Feature spec: `docs/templates/spec.yaml`
- Testcase (E2E, không unit-gen): `docs/templates/testcase.yaml`
- Readiness grill: `.cursor/extracts/codegen/readiness.md`

---

## Workflow team

- Pipeline tổng: [FEATURE-ARTIFACT-FLOWS](./FEATURE-ARTIFACT-FLOWS.md) · [FULL-CYCLE-PIPELINE-DIAGRAM](./FULL-CYCLE-PIPELINE-DIAGRAM.md)
- **Dev lane unit:** [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md) · `.cursor/skills/unit/SKILL.md` · `.cursor/skills/grill-unit/SKILL.md`
- **E2E lane:** [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md) · `.cursor/skills/test/SKILL.md` · `.cursor/skills/grill-test/SKILL.md`
- Phase prototype: `.cursor/skills/prototype/SKILL.md`
- Render docs review: `pnpm docs:render` → `docs/features/**/generated/*.md`

---

## Ví dụ end-to-end (chain hotel list)

```bash
# Sau grill + portal:gen
pnpm portal:gen --spec docs/features/yaml/chain/hotel/list/ir/spec.yaml

# Unit schema (auto — pattern implemented)
pnpm portal:unit-gen --spec docs/features/yaml/chain/hotel/list/ir/spec.yaml
pnpm exec vitest run tests/unit/models/chain-hotel/chain-hotel.schema.test.ts

# Đọc gap
cat docs/features/chain/hotel/generated/UNIT-HANDOFF.md

# E2E (sau /test)
pnpm testcase:gen --feature chain/hotel --force
pnpm test:e2e tests/e2e/chain-hotels/
```
