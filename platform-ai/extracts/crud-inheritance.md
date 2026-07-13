# CRUD inherit (3 tiers)

1. **Global** — `shared/portal-design.registry.json` `#pattern: CRUD`
2. **Archetype** — `docs/features/yaml/_patterns/admin-crud.pattern.yaml`
3. **Entity delta** — `bundle.design.inherits: admin-crud` + fields/api/ui delta only

## Pattern refs (tier 2)

Common specs path: `docs/features/yaml/common/{pattern}/common-*.bundle.yaml`

Load pattern + registry — **do not** copy full hotel bundle for entity #2.

## Entity delta checklist (tier 3)

- [ ] `design.inherits: admin-crud`
- [ ] Delta only: domain entities, zones, fields, api endpoints, permissions
- [ ] 1 bundle = 1 child function (list, create, …)
- [ ] Shell/pattern from pattern + registry (`#shell: DataListPage`, `#pattern: CRUD`)
- [ ] Trace: slice delta or member input — no full legacy re-read

Example stub: `docs/templates/entity-delta.example.yaml`

## Token budget (kỳ vọng)

| Scenario | Cost |
|----------|------|
| Hotel module lần 1 | trace + full bundle — đắt |
| Entity #2 cùng archetype | pattern + delta — rẻ |
| Sửa 1 field | `/update-spec` hoặc `/update-spec-legacy` patch — rất rẻ |
