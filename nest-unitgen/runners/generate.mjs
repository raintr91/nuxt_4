import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildFilePlan } from '../../nestgen/runners/lib/plan.mjs'
import { parseArgs, readSpecFile, toKebab } from '../../nestgen/runners/lib/read-spec.mjs'
import { renderTemplate } from './lib/render.mjs'
import { writeManifest, writeOutputs } from './lib/write-files.mjs'

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

async function loadRegistry() {
  const raw = await fs.readFile(path.join(repoRoot, 'registries/nest-unit-test.registry.json'), 'utf8')
  return JSON.parse(raw)
}

function shouldIncludePattern(pattern, wire) {
  if (!pattern.when || pattern.when === 'always') return true
  if (pattern.when.startsWith('wire.')) {
    const flag = pattern.when.slice('wire.'.length)
    return Boolean(wire?.[flag])
  }
  return true
}

function buildUnitPlan(spec, registry, options) {
  const nestPlan = buildFilePlan(spec, { repoRoot, force: options.force })
  const ctx = {
    ...nestPlan.ctx,
    moduleKebab: toKebab(nestPlan.ctx.module),
    entityKebab: toKebab(nestPlan.ctx.entity)
  }
  const files = []

  for (const [key, pattern] of Object.entries(registry.patterns ?? {})) {
    if (!shouldIncludePattern(pattern, ctx.wire)) continue
    const relativePath = pattern.output
      .replace(/\{moduleKebab\}/g, ctx.moduleKebab)
      .replace(/\{entityKebab\}/g, ctx.entityKebab)
      .replace(/\{entityPascal\}/g, ctx.entityPascal)
      .replace(/\{modulePascal\}/g, ctx.modulePascal)
    files.push({ id: key, relativePath, template: pattern.template })
  }

  return { ctx, files, nestPlan }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const registry = await loadRegistry()
  const { spec, specFile, featureDir } = await readSpecFile(options.spec)
  const plan = buildUnitPlan(spec, registry, options)

  console.log(`nest-unit-gen: ${plan.ctx.module}/${plan.ctx.entity}`)
  const outputs = []
  for (const file of plan.files) {
    const content = await renderTemplate(file.template, plan.ctx)
    outputs.push({ ...file, content })
  }

  const { written, skipped } = await writeOutputs(repoRoot, outputs, options)
  await writeManifest(featureDir, plan, specFile, options, written)

  for (const w of written) {
    console.log(`  ${options.dryRun ? '[dry]' : 'write'}: ${w}`)
  }
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
