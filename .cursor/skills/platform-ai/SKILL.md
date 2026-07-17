---
name: platform-ai
extractBundle: platform-ai
description: /platform-ai — maintain code-lane harness (.cursor) on this repo.
disable-model-invocation: true
---

# /platform-ai — harness (code repo)

Chỉ khi **sửa** skills / rules / extracts trên **repo code này** — không viết feature app.

## SSOT

| | |
|--|--|
| Harness | `.cursor/` tại **repo đang mở** |
| Gen / gaps / tags | **Artifactgraph MCP** |
| Handbook / spec grill | **base-docs** |
| E2E plans YAML | **base-tests** |

## Skills code (giữ)

FE: `/prototype` · `/grill-prototype` · `/platform-base` · `/platform-mark` · `/wire` · `/test` · `/grill-test` · `/unit` · `/grill-unit` · `/model`  
BE / fullstack thêm: `/api` · `/grill-api`

Không skill `/artifactgraph` — dùng MCP.

## Done

- [ ] Chỉ harness code-lane; không nhồi docs skills
- [ ] Rule alwaysApply tối thiểu (`platform-ai.mdc`)
