#!/usr/bin/env node
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildContractPlan } from './lib/plan.mjs'
import { parseArgs, readSpecFile } from './lib/naming.mjs'
import { writeManifest, writeOutputs } from './lib/write-files.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const IR_SPEC_GLOB_ROOT = path.join(root, 'docs/features/yaml')

async function listIrSpecFiles(dir) {
  const files = []
  let entries = []
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listIrSpecFiles(entryPath)))
      continue
    }
    if (entry.isFile() && entry.name === 'spec.yaml' && entryPath.includes(`${path.sep}ir${path.sep}`)) {
      files.push(entryPath)
    }
  }

  return files.sort()
}

async function resolveSpecPaths(options) {
  if (options.spec) return [path.resolve(options.spec)]
  const discovered = await listIrSpecFiles(IR_SPEC_GLOB_ROOT)
  if (discovered.length === 0) {
    throw new Error('No ir/spec.yaml found — pass --spec <path>')
  }
  return discovered
}

async function runForSpec(specPath, options) {
  const spec = await readSpecFile(specPath)
  const plan = buildContractPlan(spec, specPath)

  if (plan.files.length === 0) {
    console.warn(`[contract:gen] skip (no entities/fields): ${specPath}`)
    return { written: [], skipped: [] }
  }

  const { written, skipped } = await writeOutputs(root, plan, options)
  const manifest = await writeManifest(root, plan, specPath, { ...options, written, skipped })

  console.log(`[contract:gen] ${options.dryRun ? 'dry' : 'write'} ${specPath}`)
  console.log(`  files: ${written.length} written, ${skipped.length} skipped`)

  return manifest
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const specs = await resolveSpecPaths(options)

  for (const specPath of specs) {
    await runForSpec(specPath, options)
  }
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
