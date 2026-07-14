# Feature artifact — flow index

> Hub diagram + lệnh script cho layout **yaml/md** mới.  
> Load policy: `.cursor/extracts/artifact-graph.md` · commands: [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md)

**Quy ước diagram:** mỗi file **một concern**, một Mermaid ngắn — không gộp toàn pipeline vào một diagram.

---

## Layout & IR

| Doc | Nội dung |
|-----|----------|
| [FEATURE-ARTIFACT-LAYOUT](./FEATURE-ARTIFACT-LAYOUT.md) | Cây thư mục `yaml/` · `md/` · `ir/` · `generated/` |
| [CODEGEN-LAYOUT](./CODEGEN-LAYOUT.md) | Global `codegen/` · `unitgen/` · `registries/` (platform-bases) |
| [ARTIFACTGRAPH](./ARTIFACTGRAPH.md) | Local MCP gaps/tags/gen allowlist |
| [ARTIFACTGRAPH-INTERNALS](./ARTIFACTGRAPH-INTERNALS.md) | Local-first flow · tools → files · TODOs |
| [FEATURE-ARTIFACT-BUNDLE-IR](./FEATURE-ARTIFACT-BUNDLE-IR.md) | SSOT bundle → split/merge · `spec` vs `gen` |

## Team commands (AI)

| Doc | Nội dung |
|-----|----------|
| [FEATURE-ARTIFACT-LEGACY-TRACE](./FEATURE-ARTIFACT-LEGACY-TRACE.md) | `/legacy-spec` → trace + bundle.legacy |
| [FEATURE-ARTIFACT-GRILL](./FEATURE-ARTIFACT-GRILL.md) | `/bqa-grill-docs` → `/dev-grill-docs` → [`/grill-with-docs`] |
| [DESIGN-PHASE-DIAGRAM](./DESIGN-PHASE-DIAGRAM.md) | Design lane đến `/prototype` |
| [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md) | Lệnh `pnpm portal:*`, `spec:*`, `docs:render` |

## Pipeline tổng (các phase khác)

| Doc | Nội dung |
|-----|----------|
| [FULL-CYCLE-PIPELINE-DIAGRAM](./FULL-CYCLE-PIPELINE-DIAGRAM.md) | Design → Test · API → Wire → Ship |
| [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md) | E2E · `testcase:gen` |
| [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md) | Vitest · `portal:unit-gen` |
| [NEEDS-COMPONENT-FLOW](./NEEDS-COMPONENT-FLOW.md) | `#needs-component` gap loop |
| [NEEDS-TEST-FLOW](./NEEDS-TEST-FLOW.md) | needs-test gap loop |
| [NEEDS-UNIT-FLOW](./NEEDS-UNIT-FLOW.md) | `#needs-unit-test` gap loop |
| [BACKEND-PHASE-DIAGRAM](./BACKEND-PHASE-DIAGRAM.md) | API repo |
| [WIRE-PHASE-DIAGRAM](./WIRE-PHASE-DIAGRAM.md) | Integration |
| [UPDATE-SPEC-FLOW](./UPDATE-SPEC-FLOW.md) | Gap loop |

---

## Lệnh thường dùng (copy nhanh)

```bash
# Authoring (1 lệnh phase)
pnpm phase:spec -- docs/features/yaml/admin/hotel/list/hotel-list.bundle.yaml

# Authoring toàn bộ (quét yaml/**, không cần file)
pnpm phase:spec
pnpm spec:split:all

# Common (shared) — tách riêng features
pnpm phase:common
pnpm spec:split:common
pnpm docs:render:common
# Common gen (cần codegen.profile trong mỗi spec)
pnpm portal:gen:dry:common

# Codegen (1 lệnh phase)
pnpm phase:gen -- --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml

# Unit / E2E (1 lệnh phase)
pnpm phase:unit -- --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm phase:e2e -- admin/hotel

# Hạt nhân (giữ nguyên để review từng bước)
pnpm spec:split -- docs/features/yaml/admin/hotel/list/hotel-list.bundle.yaml
pnpm spec:split:check -- docs/features/yaml/admin/hotel/list/hotel-list.bundle.yaml
pnpm spec:normalize-gen -- docs/features/yaml/.../foo.bundle.yaml --write
pnpm portal:gen:dry --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm portal:gen --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm docs:render

# Validate infra
pnpm legacy-trace:validate -- docs/features/yaml/admin/hotel/_legacy.trace.yaml
pnpm extracts:validate
```

Chi tiết từng lệnh: [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md)
