# Portal E2E semantic + axe tags

> Registry: `shared/portal-e2e-test.registry.json` · Validate: `pnpm portal:e2e-registry`  
> Hub: `docs/operational/E2E-SEMANTIC-UI-ASSERTIONS.md` · Gen: `testcase:gen`

## Hashtags on testcase `tags:`

| Tag | Bundle | Matchers |
|-----|--------|----------|
| `#e2e:semantic-smoke` | Level 1 | console, horizontal scroll, broken images |
| `#e2e:semantic-list` | List page | smoke + text overflow + table layout + overlap |
| `#e2e:semantic-form` | Form page | smoke + text overflow |
| `#e2e:a11y-wcag` | Axe WCAG A/AA | `toHaveNoA11yViolations` (scoped `rootTestId`) |
| `#e2e:a11y-presets` | Axe presets | names, aria, media, document |
| `#e2e:a11y-full` | Full a11y | wcag + presets |

Opt-out: `#skip-e2e-assert:{matcher}` (e.g. `#skip-e2e-assert:toHaveNoElementOverlap`).

## YAML block (union with tags)

```yaml
assertions:
  semantic:
    ready:
      rootTestId: hotels-page
      waitForTestIds: [hotels-table]
    level1: [toHaveNoConsoleErrors]
    layout: [toHaveValidTableLayout]
    accessibility: [toHaveNoA11yViolations]
    layoutOptions:
      skipOverlap: true
```

**Required:** `assertions.semantic.ready.rootTestId` when any semantic matcher is active.

## Gen behavior

- Matchers → `tests/e2e/fixtures/semantic-ui.ts` `expect` extensions
- Spec imports `../fixtures/semantic-ui` when matchers present
- `waitForSemanticReady` on PO when `semantic.ready` is set
