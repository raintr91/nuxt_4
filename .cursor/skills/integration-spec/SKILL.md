---
name: integration-spec
extractBundle: dev-grill
description: /integration-spec — pointer to integration repo spec workflow.
disable-model-invocation: true
---

# /integration-spec (portal router)

**Chạy trong integration repo** — không author adapter yaml trên portal.

```bash
cd ~/workspace/integration
# skill: .cursor/skills/integration-spec/SKILL.md
pnpm spec:split -- docs/features/yaml/.../downtime.bundle.yaml
```

Detail: `~/workspace/integration/docs/operational/INTEGRATION-SPEC-WORKFLOW.md`
