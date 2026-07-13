#!/usr/bin/env node
/**
 * Validate registries/common.registry.json
 * Usage: node registries/validate-common.mjs [validate|show]
 */
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REGISTRY_REL = 'registries/common.registry.json'

async function pathExists(relativePath) {
  try {
    await access(path.join(root, relativePath))
    return true
  } catch {
    return false
  }
}

async function loadRegistry() {
  const raw = await readFile(path.join(root, REGISTRY_REL), 'utf8')
  return JSON.parse(raw)
}

async function validate() {
  const registry = await loadRegistry()
  const errors = []
  const warnings = []

  console.log(`platform-common.registry v${registry.version}`)
  console.log(`  path: ${REGISTRY_REL}`)
  console.log(`  entries: ${Object.keys(registry.entries ?? {}).length}`)

  for (const [id, entry] of Object.entries(registry.entries ?? {})) {
    const tag = entry.tag ?? ''
    const expectedTag = `#common:${id.replace(/\./g, '-')}`
    if (tag && !tag.startsWith('#common:')) {
      errors.push(`${id}: tag must start with #common: (got ${tag})`)
    }
    if (entry.status === 'implemented') {
      if (!entry.path) errors.push(`${id}: implemented requires path`)
      if (!entry.symbol) errors.push(`${id}: implemented requires symbol`)
      if (entry.path && !(await pathExists(entry.path))) {
        errors.push(`${id}: missing file ${entry.path}`)
      }
    }
    if (entry.status === 'planned') {
      warnings.push(`${id}: planned (${entry.path ?? 'no path yet'})`)
    }
  }

  for (const [alias, id] of Object.entries(registry.aliasIndex ?? {})) {
    if (!registry.entries?.[id]) {
      errors.push(`aliasIndex "${alias}" → unknown entry "${id}"`)
    }
  }

  for (const warning of warnings) {
    console.warn(`  warn: ${warning}`)
  }

  if (errors.length) {
    for (const err of errors) console.error(`  error: ${err}`)
    process.exit(1)
  }

  console.log('  OK')
}

async function show() {
  const registry = await loadRegistry()
  console.log(JSON.stringify(registry, null, 2))
}

const cmd = process.argv[2] ?? 'validate'
if (cmd === 'validate') await validate()
else if (cmd === 'show') await show()
else {
  console.error(`Usage: node registries/validate-common.mjs [validate|show]`)
  process.exit(1)
}
