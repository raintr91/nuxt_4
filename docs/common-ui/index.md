# Common UI Patterns

Source of truth: **`docs/features/yaml/common/{pattern}/*.bundle.yaml`** → render → **`docs/features/md/common/{pattern}/*.md`**.

**Design registry (shadcn canonical + shells):** `registries/design.registry.json` — `#shell: DataListPage`, `#widget:`, `#ui:`. Validate: `pnpm portal:registry`. **Codegen hub:** [PORTAL-CODEGEN.md](/operational/PORTAL-CODEGEN). **Promotion sau prototype:** [DESIGN-REGISTRY-PROMOTION.md](/operational/DESIGN-REGISTRY-PROMOTION).

Agent: `.cursor/extracts/common-ui-spec.md`. Trước khi copy UI legacy ad hoc, bám common bundle hoặc ghi `#legacy-global-ui-violation` kèm evidence.

## Review (BA/QA)

Sau `pnpm docs:render`, xem [generated.md](/common-ui/generated) hoặc bảng dưới.

| Pattern | Bundle (yaml) | Markdown review |
|---------|---------------|-----------------|
| List page shell | `yaml/common/list-page/common-list-page.bundle.yaml` | [md](/features/md/common/list-page/common-list-page) |
| List toolbar | `yaml/common/list-toolbar/common-list-toolbar.bundle.yaml` | [md](/features/md/common/list-toolbar/common-list-toolbar) |
| Search filter | `yaml/common/search-filter/common-search-filter.bundle.yaml` | [md](/features/md/common/search-filter/common-search-filter) |
| Data table | `yaml/common/data-table/common-data-table.bundle.yaml` | [md](/features/md/common/data-table/common-data-table) |
| Table actions | `yaml/common/table-action-column/common-table-action-column.bundle.yaml` | [md](/features/md/common/table-action-column/common-table-action-column) |
| Pagination | `yaml/common/pagination/common-pagination.bundle.yaml` | [md](/features/md/common/pagination/common-pagination) |
| Buttons | `yaml/common/buttons/common-buttons.bundle.yaml` | [md](/features/md/common/buttons/common-buttons) |
| Status chip | `yaml/common/status-chip/common-status-chip.bundle.yaml` | [md](/features/md/common/status-chip/common-status-chip) |
| Form validation | `yaml/common/form-validation/common-form-validation.bundle.yaml` | [md](/features/md/common/form-validation/common-form-validation) |
| Feedback / alerts | `yaml/common/feedback/common-feedback.bundle.yaml` | [md](/features/md/common/feedback/common-feedback) |
| Confirm dialog | `yaml/common/confirm-dialog/common-confirm-dialog.bundle.yaml` | [md](/features/md/common/confirm-dialog/common-confirm-dialog) |
| CSV import | `yaml/common/import-csv/common-import-csv.bundle.yaml` | [md](/features/md/common/import-csv/common-import-csv) |
| Navigation / header | `yaml/common/navigation/common-navigation.bundle.yaml` | [md](/features/md/common/navigation/common-navigation) |
| Flat design | `yaml/common/flat-design/common-flat-design.bundle.yaml` | [md](/features/md/common/flat-design/common-flat-design) |
| Breadcrumb flow | `yaml/common/breadcrumb-flow/common-breadcrumb-flow.bundle.yaml` | [md](/features/md/common/breadcrumb-flow/common-breadcrumb-flow) |
| Delete flow | `yaml/common/delete-flow/common-delete-flow.bundle.yaml` | [md](/features/md/common/delete-flow/common-delete-flow) |

## Code conventions

- List pages: `#shell: DataListPage` — không `#ui: DataTable` làm shell.
- `#pattern: CRUD` + common specs thay vì copy layout legacy.
- Grill đọc `ir/design.yaml` + common bundles — không đọc legacy source.
