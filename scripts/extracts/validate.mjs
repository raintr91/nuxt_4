#!/usr/bin/env node
/**
 * Validate extract registry + skill extractBundle frontmatter.
 * Usage: pnpm extracts:validate
 */
import { readFile, access } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const registryPath = path.join(root, '.cursor/extracts/extract-registry.json')
const skillsDir = path.join(root, '.cursor/skills')

const MOVED_FLAT_STUBS = [
  '.cursor/extracts/agent-discipline.md',
  '.cursor/extracts/legacy-config.md',
  '.cursor/extracts/legacy-blade-to-api.md',
  '.cursor/extracts/grill-docs-roles.md',
  '.cursor/extracts/spec-split-by-function.md',
  '.cursor/extracts/portal-test-readiness.md',
  '.cursor/extracts/portal-codegen-readiness.md',
  '.cursor/extracts/portal-codegen-tags.md'
]

const EXEMPT_SKILLS = new Set(['platform-base'])

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const fm = match[1]
  const extractBundle = fm.match(/^extractBundle:\s*(.+)$/m)?.[1]?.trim()
  return { extractBundle }
}

async function fileExists(relativePath) {
  try {
    await access(path.join(root, relativePath))
    return true
  } catch {
    return false
  }
}

async function listSkillFiles() {
  const entries = await readdir(skillsDir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const skillFile = path.join(skillsDir, entry.name, 'SKILL.md')
    if (await fileExists(path.relative(root, skillFile))) files.push(skillFile)
  }
  return files.sort()
}

async function main() {
  const errors = []
  const registry = JSON.parse(await readFile(registryPath, 'utf8'))
  const bundleIds = new Set(Object.keys(registry.bundles ?? {}))

  for (const [bundleId, files] of Object.entries(registry.bundles ?? {})) {
    if (!Array.isArray(files) || !files.length) {
      errors.push(`registry: bundle "${bundleId}" is empty`)
      continue
    }
    for (const file of files) {
      if (!(await fileExists(file))) {
        errors.push(`registry: missing file for ${bundleId}: ${file}`)
      }
    }
  }

  const skillFiles = await listSkillFiles()
  for (const skillFile of skillFiles) {
    const rel = path.relative(root, skillFile)
    const content = await readFile(skillFile, 'utf8')
    const skillName = path.basename(path.dirname(skillFile))
    const fm = parseFrontmatter(content)

    if (EXEMPT_SKILLS.has(skillName)) continue

    if (!fm.extractBundle) {
      errors.push(`${rel}: missing frontmatter extractBundle`)
      continue
    }

    if (!bundleIds.has(fm.extractBundle)) {
      errors.push(`${rel}: unknown extractBundle "${fm.extractBundle}"`)
    }

    if (/Shared extracts:/i.test(content)) {
      errors.push(`${rel}: still has "Shared extracts:" — use extractBundle only`)
    }

    for (const stub of MOVED_FLAT_STUBS) {
      if (content.includes(stub)) {
        errors.push(`${rel}: references removed flat stub ${stub}`)
      }
    }
  }

  if (errors.length) {
    console.error(`extracts:validate: FAIL (${errors.length})`)
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }

  console.log(
    `extracts:validate: OK — ${bundleIds.size} bundle(s), ${skillFiles.length - EXEMPT_SKILLS.size} skill(s) checked`
  )
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
