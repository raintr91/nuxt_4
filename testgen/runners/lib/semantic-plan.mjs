import {
  bundleIdsFromTags,
  loadE2eTestRegistry,
  resolveBundleMatchers,
  skipMatchersFromTags
} from './e2e-registry.mjs'

const SECTION_KEYS = ['level1', 'layout', 'accessibility', 'designToken']

/**
 * @param {string} root
 * @param {Record<string, unknown>} testcase
 */
export async function resolveSemanticPlan(root, testcase) {
  const { registry } = await loadE2eTestRegistry(root)
  const tags = testcase.tags ?? []
  const semantic = testcase.assertions?.semantic ?? {}
  const warnings = []

  const skipMatchers = skipMatchersFromTags(tags, registry)
  const bundleIds = bundleIdsFromTags(tags, registry)
  const bundles = registry.bundles ?? {}
  const matcherMeta = registry.matchers ?? {}

  /** @type {string[]} */
  const ordered = []

  for (const bundleId of bundleIds) {
    ordered.push(...resolveBundleMatchers(bundleId, bundles))
  }

  for (const key of SECTION_KEYS) {
    const list = semantic[key]
    if (Array.isArray(list)) {
      ordered.push(...list.map(String))
    }
  }

  const seen = new Set()
  /** @type {string[]} */
  const matchers = []
  for (const name of ordered) {
    if (skipMatchers.has(name)) continue
    if (seen.has(name)) continue
    const meta = matcherMeta[name]
    if (!meta) {
      warnings.push(`unknown semantic matcher "${name}" — add to portal-e2e-test.registry.json`)
      continue
    }
    if (meta.status === 'planned') {
      warnings.push(`semantic matcher "${name}" is planned — skipped in codegen`)
      continue
    }
    seen.add(name)
    matchers.push(name)
  }

  const semanticReady = semantic.ready ?? null
  const rootTestId = semanticReady?.rootTestId ?? semantic.rootTestId ?? null
  const tableTestId =
    semantic.tableTestId ??
    semanticReady?.waitForTestIds?.find((id) => String(id).includes('table')) ??
    null

  const layoutOptions = semantic.layoutOptions ?? {}
  const skipOverlap = layoutOptions.skipOverlap === true

  if (matchers.length && !rootTestId) {
    warnings.push('semantic matchers require assertions.semantic.ready.rootTestId (or semantic.rootTestId)')
  }

  if (matchers.includes('toHaveValidTableLayout') && !tableTestId) {
    warnings.push('toHaveValidTableLayout requires semantic.tableTestId or waitForTestIds containing "table"')
  }

  const needsConsoleErrors = matchers.some(
    (name) => matcherMeta[name]?.needsConsoleErrors === true
  )
  const useSemanticFixture = matchers.length > 0

  const codegenLines = matchers
    .map((name) => codegenMatcher(name, { rootTestId, tableTestId, skipOverlap }))
    .filter(Boolean)

  return {
    semanticReady,
    useSemanticFixture,
    needsConsoleErrors,
    semanticCodegenLines: codegenLines,
    semanticMatchers: matchers,
    rootTestId,
    warnings
  }
}

/**
 * @param {string} matcher
 * @param {{
 *   rootTestId: string | null,
 *   tableTestId: string | null,
 *   skipOverlap: boolean
 * }} ctx
 */
function codegenMatcher(matcher, ctx) {
  const { rootTestId, tableTestId, skipOverlap } = ctx
  const include = rootTestId ? `[data-testid="${rootTestId}"]` : undefined
  const a11yOpts = include ? `{ include: '${include}' }` : '{}'
  const rootLoc = rootTestId ? `page.getByTestId('${rootTestId}')` : 'page.locator("body")'
  const scrollOpts = include ? `{ rootSelector: '${include}' }` : '{}'
  const overflowOpts = `{ allowTruncate: true }`

  switch (matcher) {
    case 'toHaveNoConsoleErrors':
      return 'await expect(page).toHaveNoConsoleErrors(consoleErrors)'
    case 'toHaveNoHorizontalScroll':
      return `await expect(page).toHaveNoHorizontalScroll(${scrollOpts})`
    case 'toHaveNoBrokenImages':
      return 'await expect(page).toHaveNoBrokenImages()'
    case 'toHaveNoTextOverflow':
      return `await expect(${rootLoc}).toHaveNoTextOverflow(${overflowOpts})`
    case 'toHaveNoElementOverlap':
      if (skipOverlap) return null
      return `await expect(${rootLoc}).toHaveNoElementOverlap()`
    case 'toHaveValidTableLayout':
      if (!tableTestId) return null
      return `await expect(page.getByTestId('${tableTestId}')).toHaveValidTableLayout()`
    case 'toHaveNoA11yViolations':
      return `await expect(page).toHaveNoA11yViolations(${a11yOpts})`
    case 'toHaveValidAccessibleNames':
      return `await expect(page).toHaveValidAccessibleNames(${a11yOpts})`
    case 'toHaveValidAria':
      return `await expect(page).toHaveValidAria(${a11yOpts})`
    case 'toHaveAccessibleMedia':
      return `await expect(page).toHaveAccessibleMedia(${a11yOpts})`
    case 'toHaveReadableContrast':
      return `await expect(page).toHaveReadableContrast(${a11yOpts})`
    case 'toHaveValidDocumentSemantics':
      return `await expect(page).toHaveValidDocumentSemantics(${a11yOpts})`
    case 'toMatchShadcnTableToken':
      if (!tableTestId) return null
      return `await expect(page.getByTestId('${tableTestId}')).toMatchShadcnTableToken()`
    default:
      return null
  }
}
