import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Handlebars from 'handlebars'

import { listFeatureTestcases, readTestcaseFile } from './lib/read-testcase.mjs'
import { renderTemplate } from './lib/render.mjs'
import { resolveSemanticPlan } from './lib/semantic-plan.mjs'
import { writeOutputs } from './lib/write-files.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

Handlebars.registerHelper('eq', (a, b) => a === b)
Handlebars.registerHelper('and', (a, b) => a && b)
Handlebars.registerHelper('not', (a) => !a)
Handlebars.registerHelper('or', (a, b) => a || b)
Handlebars.registerHelper('startsWith', (value, prefix) => String(value).startsWith(prefix))
Handlebars.registerHelper('includes', (value, fragment) => String(value).includes(fragment))
Handlebars.registerHelper('json', (value) => JSON.stringify(value, null, 2))

function parseArgs(argv) {
  const options = { dryRun: false, force: false, testcase: null, feature: null }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run' || arg === '--dry') options.dryRun = true
    else if (arg === '--force') options.force = true
    else if (arg === '--testcase') options.testcase = argv[++i]
    else if (arg === '--feature') options.feature = argv[++i]
    else if (!arg.startsWith('-') && !options.testcase && !options.feature) options.testcase = arg
  }

  if (!options.testcase && !options.feature) {
    throw new Error(
      'Usage: pnpm testcase:gen --testcase docs/features/.../testcases/foo.yaml\n' +
        '       pnpm testcase:gen --feature chain/hotel [--dry-run] [--force]'
    )
  }

  return options
}

async function generateOne(testcasePath, options) {
  const { testcase, spec, testcaseFile, specFile } = await readTestcaseFile(testcasePath)
  const ctx = buildTestcaseContext(testcase, spec, testcaseFile)
  ctx.specFile = specFile

  const semantic = await resolveSemanticPlan(root, testcase)
  ctx.useSemanticFixture = semantic.useSemanticFixture
  ctx.needsConsoleErrors = semantic.needsConsoleErrors
  ctx.semanticCodegenLines = semantic.semanticCodegenLines
  ctx.semanticReady = semantic.semanticReady ?? ctx.semanticReady
  ctx.hasLegacyLayoutOnly = Boolean(ctx.semanticReady) && !semantic.useSemanticFixture
  ctx.warnings.push(...semantic.warnings)

  const pageContent = await renderTemplate('page.ts.hbs', ctx)
  const specContent = await renderTemplate('spec.ts.hbs', ctx)

  const outputs = [
    { relativePath: ctx.outputs.pageObject, content: pageContent },
    { relativePath: ctx.outputs.spec, content: specContent }
  ]

  const { written, skipped } = await writeOutputs(root, outputs, {
    dryRun: options.dryRun,
    force: options.force
  })

  console.log(`testcase-gen: id=${ctx.testcaseId} module=${ctx.module}`)
  console.log(`  testcase: ${testcaseFile}`)
  if (specFile) console.log(`  spec: ${specFile}`)
  if (ctx.warnings.length) {
    for (const warning of ctx.warnings) console.warn(`  warn: ${warning}`)
  }
  for (const item of written) {
    console.log(`  ${options.dryRun ? 'would write' : 'write'}: ${item.relativePath}`)
  }
  for (const item of skipped) {
    console.log(`  skip: ${item.relativePath} (${item.reason})`)
  }

  return { ctx, written, skipped }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.feature) {
    const paths = await listFeatureTestcases(root, options.feature)
    if (!paths.length) {
      throw new Error(`No testcases in docs/features/${options.feature}/testcases/`)
    }
    for (const testcasePath of paths) {
      await generateOne(testcasePath, options)
    }
    return
  }

  await generateOne(options.testcase, options)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
