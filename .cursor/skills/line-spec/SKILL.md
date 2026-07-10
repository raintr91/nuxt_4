---
name: line-spec
extractBundle: line-prototype
description: /line-spec — pointer to line repo spec workflow.
disable-model-invocation: true
---

# /line-spec (portal router)

**Chạy trong line repo** — không author `clients.line` trên portal.

```bash
cd ~/workspace/line
# skill: .cursor/skills/line-spec/SKILL.md
pnpm spec:split -- docs/features/yaml/.../workforce.bundle.yaml
```

Portal chỉ giữ **entities** trong `ir/spec.yaml` cho `contract:gen`.

Detail: `~/workspace/line/docs/operational/LINE-SPEC-WORKFLOW.md`
