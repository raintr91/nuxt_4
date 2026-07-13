# Portal unit-gen — Roadmap PR0 → PR12

> Hub: [PORTAL-CODEGEN](./PORTAL-CODEGEN.md) · Script: `unitgen/runners/README.md`

**Phạm vi:** chỉ **Portal FE** (`portal:unit-gen`). **`api:unit-gen` / BE PHPUnit** — **để sau**, repo `~/workspace/api` track riêng khi portal PR3–11 ổn.

Trạng thái tại **2026-06-27** (cập nhật khi xong từng PR).

| PR | Tên | Trạng thái | Deliverable chính |
|----|-----|------------|-------------------|
| **0** | Registry + helpers | ✅ Done | `portal-unit-test.registry.json`, `mockApiFetch.ts`, `pnpm portal:unit-registry` |
| **1** | Schema + manifest | ✅ Done | `schema.test.ts.hbs`, `unit.manifest.json`, `UNIT-HANDOFF.md`, `#gen:test-schema` |
| **2** | Service list (prototype) | ✅ Done | `service.search.test.ts.hbs` GET/POST, `#gen:test-service`, default `phasePrototype: schema+service` |
| **3** | Validation (create) | ✅ Done | `validations/schemas.test.ts.hbs`, `*CreateObjectSchema` export trong portal-gen |
| **4** | Composable list | ✅ Done | `use-list.test.ts.hbs`, `nuxtGlobals.ts`, `defaults.phasePrototype` + composable |
| **5** | Composable form + create service | ✅ Done | `use-form.test.ts.hbs`, `service.create.test.ts.hbs`, `phaseCreate` + `service` |
| **6** | Service export / custom endpoint | ✅ Done | `service.export.test.ts.hbs` khi `action: export` |
| **7** | Wire phase delta | ✅ Done | `--phase wire` → `service.wire.test.ts.hbs`; prototype layers skip trừ `#gen:test-*` |
| **8** | Registry promote + doc | ✅ Done | `UNIT-REGISTRY-PROMOTION.md`, `promotedFeatures[]` workflow |
| **9** | Common rules + grill | ✅ Done | `portal-unit-test-common.md`; grill default `#gen:test-schema` + `#gen:test-service` (list) |
| **10** | Manifest → spec tags (opt-in) | ✅ Done | `--write-spec-tags` merge `#needs-unit-test:*` vào `tags:` (idempotent) |
| **11** | Skill / grill-unit shrink | ✅ Done | `UNIT-PHASE-DIAGRAM.md`, `portal-unit-workflow.md`, skills `/unit` + `/grill-unit` |
| **12** | E2E `testcase:gen` (tách pipeline) | ✅ Done | `testgen/runners/` — PO + spec từ testcase YAML; pilot `chain/hotel` 3 specs green |
| **13a** | E2E semantic registry + gen | ✅ Done | `portal-e2e-test.registry.json`, `#e2e:*` bundles, axe/layout codegen |

---

## Chi tiết từng PR

### PR0 — Registry + helpers ✅

- `registries/unit-test.registry.json` (patterns, `commonBaselines`, tag prefixes)
- `tests/unit/_helpers/mockApiFetch.ts`
- `pnpm portal:unit-registry`
- Doc hub: `PORTAL-CODEGEN.md`

### PR1 — Schema + manifest ✅

- `portal:unit-gen` script tách `portal-gen`
- Pattern `schema.parseListColumns` → `tests/unit/models/{entity}/{entity}.schema.test.ts`
- `unit.manifest.json`, `UNIT-HANDOFF.md`
- Extract: `portal-unit-test-tags.md`

### PR2 — Service list ✅

- Patterns `service.searchGet` / `service.searchPost`
- `tests/unit/services/{entity}.service.test.ts` — mock `apiFetch`, assert path/method (mẫu `v2-mairy-admin/auth.service.test.ts`)
- `defaults.phasePrototype`: `schema`, `service`
- Extract: `portal-unit-test-common.md`

### PR3 — Validation (create)

- Profile `create` → `tests/unit/validations/{entity}/schemas.test.ts`
- Mỗi field required: 1 fail + 1 valid pass (từ `formFieldSchemas`)
- Tag: `#gen:test-validation`
- Tham chiếu: `saas-admin-tentant/validations/admin/schemas.test.ts`

### PR4 — Composable list

- Pattern `composable.useList` → `implemented` sau khi pilot `useChainHotelList.test.ts` ổn
- Mock **service** (không mount page, không Nuxt full)
- Tag fallback: `#needs-unit-test:composable:use{Entity}List` cho đến khi promote

### PR5 — Composable form + create service

- `useForm` + `service.create` (POST body assert)
- Profile `create` bổ sung vào `defaults.phasePrototype`

### PR6 — Export / custom API

- Khi `api.endpoints` có `export` hoặc `#manual-composable: export*` — gen `exportReport` test hoặc HANDOFF
- Không gộp vào file service search nếu file > ~80 dòng — tách `*.service.export.test.ts`

### PR7 — Wire phase

```bash
pnpm portal:unit-gen --spec … --phase wire
```

- Bổ sung: `assertApiSuccess` failure, envelope `meta`, blob `responseType`
- Chỉ layer `service` (+ validation nếu rules đổi)
- Spec `#wire-only:*` cleared sau wire → gen assert thật hơn (vẫn mock `apiFetch` ở unit)

### PR8 — Promote registry

- Doc `UNIT-REGISTRY-PROMOTION.md`: khi nào promote pattern, checklist, `pnpm portal:unit-registry`
- Ghi `promotedFeatures[]` (audit: chain-hotel list đã pilot composable chưa)

### PR9 — Grill + defaults

- `/dev-grill-docs` / `/grill-with-docs` default tags list: `#gen:test-schema`, `#gen:test-service`
- Create profile: `#gen:test-validation`
- Link extract trong skills `unit`, `dev-grill-docs`

### PR10 — Spec tag sync (optional)

- CLI `--write-spec-tags` merge `#needs-unit-test` từ manifest vào `tags:` (idempotent)
- Mặc định vẫn chỉ HANDOFF — tránh AI sửa spec không kiểm soát

### PR11 — Token / workflow ✅

- `docs/operational/UNIT-PHASE-DIAGRAM.md` — 2 Mermaid: unit lane + `#needs-unit-test` lifecycle (**không** FULL-CYCLE)
- `.cursor/extracts/portal-unit-workflow.md` — checklist token-thin
- Skills `/unit` (gap + gen + file) · `/grill-unit` (coverage + reqIds)
- VitePress sidebar: Unit phase — dev lane

### PR12 — `testcase:gen` (E2E, pipeline riêng) ✅

- **Không** gộp vào `portal-unit-gen`
- Input: `testcases/*.yaml` + spec cross-check testIds
- Output: Page Object + `*.spec.ts` + session/mock registry
- Pilot: `chain/hotel` 3 specs green
- Diagram: [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md)

### PR13a — E2E semantic + axe registry ✅

- `registries/e2e-test.registry.json` · `pnpm portal:e2e-registry`
- Hashtag `#e2e:semantic-*`, `#e2e:a11y-*` · `semantic-plan.mjs` codegen
- Extract: `.cursor/extracts/platform-e2e-semantic-tags.md`

### PR13b — Flow partials (planned)

- Delete / confirm dialog / CSV import bundles
- `partials/flow-*.hbs` · `#e2e:flow-*` tags

---

## Deferred — API / BE (không làm song song)

> **Quyết định:** làm **portal trước**; API mirror sau.

| Item | Repo | Khi nào |
|------|------|---------|
| `api:unit-gen` | `~/workspace/api` | Sau portal PR3–11 ổn (hoặc khi có feature BE pilot riêng) |
| `RefreshDatabase` opt-in | API `TestCase` | Cùng đợt `api:unit-gen` |
| `unit-mocking.md` (BE) | API extracts | `#test-mock:db-none`, `Http::fake`, `Mail::fake` |

Không block PR portal; chỉ tham chiếu pattern khi thiết kế `portal-unit-test.registry.json`.

## Thứ tự ưu tiên (portal only)

1. **PR3** validation — khi có feature `create` pilot  
2. **PR4–5** composable — sau khi review service test chain-hotel  
3. **PR7–8** wire + promote — trước scale nhiều feature  
4. **PR9–11** grill + skill — giảm token  
5. **PR12** E2E `testcase:gen` — khi cần QA acceptance  
6. **API `api:unit-gen`** — deferred, không song song với trên
