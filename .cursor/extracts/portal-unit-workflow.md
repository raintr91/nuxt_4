# Portal unit workflow — dev lane (token-thin)

> Diagram: [`base-docs/platform/toolchain/UNIT-PHASE-DIAGRAM.md`](../../base-docs/platform/toolchain/UNIT-PHASE-DIAGRAM.md) (flow chính + tag lifecycle tách riêng)  
> **Không** nằm FULL-CYCLE / TEST-PHASE diagram.

## `/unit` — gap + gen + file thiếu

1. `pnpm portal:unit-gen --id W-…` (IR + codegen.manifest trên base-docs Code)
2. `UNIT-HANDOFF.md` — lệnh vitest scoped
3. Nếu chưa smoke → `pnpm portal:unit-gen --spec …` (`--phase wire` nếu cần)
4. `needsUnit[]` / `#needs-unit-test:*`:
   - pattern `implemented` → `--force` hoặc sửa theo `registries/unit-test.registry.json`
   - `#manual-composable` / `#wire-only` → test tay hoặc `#skip-unit-test` + lý do
5. Tách file nếu thiếu pattern (`*.service.create.test.ts`, …)
6. `pnpm exec vitest run <manifest.written paths>` — green

**Đọc thêm khi gap:** `codegen.manifest.json` `files[]` (logic layers only), spec `requirements` filter `reqIds` từ manifest.

**Không đọc:** `pages/`, `components/`, inventory `tests/unit/`, E2E testcase, design registry.

## `/grill-unit` — sau `/unit`

1. Chỉ manifest + coverage scoped entity
2. `vitest run … --coverage` — target 100% trên file logic feature (không cả monorepo)
3. Map `reqIds` ↔ `it()` — acceptance **logic**, không UI
4. Báo bảng gap: `file | uncovered | 1 case đề xuất`
5. Không gọi `portal:unit-gen`; không `mount()` Vue

## Mock boundary

| Layer | Mock |
|-------|------|
| Service | `tests/unit/_helpers/mockApiFetch.ts` |
| Composable list | `{entity}MockSearch` |
| Composable form | `useApiForm` stub + `{entity}MockCreate` + `useRouter` |
| Nuxt globals | `tests/unit/_helpers/nuxtGlobals.ts` |

## Done

| Phase | Done khi |
|-------|----------|
| `/unit` | `needsUnit: []`, vitest scoped green |
| `/grill-unit` | coverage + reqIds OK, hoặc gap có lý do documented |
