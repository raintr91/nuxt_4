# Portal Design Registry

> **Hub:** [`docs/operational/PORTAL-CODEGEN.md`](../../docs/operational/PORTAL-CODEGEN.md) (`portal:gen` UI registry)

**File:** `registries/design.registry.json`  
**Commands:** `pnpm portal:registry` · `pnpm portal:gen:dry`

## Mục đích

- **shadcn/ui** = canonical hashtag (`#ui: Dialog`).
- **Portal shells** = `#shell: DataListPage` (list chuẩn common gen).
- Material / Ant / Apple / tiếng Việt mơ hồ → `aliasIndex` → canonical.
- **portal-gen** resolve shell, template list, validate tags trước khi gen.

## Hashtag prefixes

| Prefix | Registry section |
|--------|------------------|
| `#shell:` | `shells` |
| `#pattern:` | `patterns` |
| `#ui:` | `components` (auto-discover `components/ui/*`) |
| `#widget:` | `fieldWidgets` |
| `#render:` | `detailRenders` |
| `#shape:` | `fieldWidgets` shapes |
| `#style:` | `styles` |
| `#needs-ui:` | planned widget — HANDOFF |

## Shells (portal organisms)

| Shell | Profile default | Gen |
|-------|-----------------|-----|
| `DataListPage` | `list` | `list/page.vue.hbs` hoặc `page.custom.vue.hbs` |
| `DataTablePage` | — | dashboard table đơn giản |
| `DataFormPage` | `create`, `edit` | `create/page.vue.hbs` (planned organism) |
| `DataDetailPage` | `detail` | planned |
| `custom` | override | custom template + notes |

**List alias:** `DataListTable`, `common list`, `datalisttable` → `DataListPage`.

## List default tags (grill)

```yaml
tags:
  - "#shell: DataListPage"
  - "#pattern: CRUD"
  - "#style: shadcn/ui"
  - "#style: compact"
  - "#style: flat"
```

Custom variant: `overrideCommonPattern: true` + vẫn `#shell: DataListPage`.

## Field widgets & shapes

| Widget | Shape | Portal |
|--------|-------|--------|
| Input, Select, Textarea, … | scalar | `components/ui/*` + `FormField` |
| TagsInput | array | ui |
| Repeater | array | `MoRepeaterField` (planned) |
| DynamicFieldList | dynamic | planned |
| FieldGroup | nested_object | planned |

Detail: `#render: text` | `chip` | `badge`

## Grill: fuzzy → member chọn

Registry `fuzzyGroups`: ví dụ `drawer` vs `Sheet` vs `Drawer` — grill hiện options, member chọn, ghi `#ui:` canonical.

## API trong portal-gen

- `loadDesignRegistry(root)`
- `parseDesignTags(tags)`
- `lookupAlias(text, registry)`
- `resolveShell({ profile, composition, designTags, registry })`
- `applyDesignRegistry(ctx, registry)`
- `validateSpecDesign(ctx, registry)`

## Bảo trì

1. Thêm shadcn: `pnpm ui:add` → chạy `pnpm portal:registry` (auto-discover folder).
2. Thêm shell/widget: sửa JSON + `componentAliases` / `aliasIndex`.
3. Planned → `status: planned` + grill dùng `#needs-ui:`.

## Registry promotion (chỉ /prototype)

Sau khi implement `Mo*` từ **spec `tags:`** — không từ HANDOFF gen. Gen chỉ ghi slot thiếu (*Prototype next*).

Chi tiết: [DESIGN-REGISTRY-PROMOTION.md](../../docs/operational/DESIGN-REGISTRY-PROMOTION.md)

Rule: `.cursor/rules/platform-design-vocabulary.mdc`
