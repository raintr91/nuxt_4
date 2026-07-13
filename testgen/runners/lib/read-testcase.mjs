import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'
import { resolveFeatureDir } from '../../../codegen/runners/lib/read-spec.mjs'

/**
 * @param {string} testcasePath
 */
export async function readTestcaseFile(testcasePath) {
  const absolute = path.resolve(testcasePath)
  const raw = await readFile(absolute, 'utf8')
  const testcase = parse(raw) ?? {}

  if (!testcase.id) {
    throw new Error(`Missing id in ${testcasePath}`)
  }
  if (testcase.type && testcase.type !== 'e2e') {
    throw new Error(`testcase:gen only supports type e2e — got "${testcase.type}" in ${testcasePath}`)
  }

  const featureDir = resolveFeatureDir(absolute)
  const irSpecPath = path.join(featureDir, 'ir', 'spec.yaml')
  let spec = null
  let specFile = null

  try {
    const specRaw = await readFile(irSpecPath, 'utf8')
    spec = parse(specRaw) ?? {}
    specFile = path.relative(process.cwd(), irSpecPath)
  } catch {
    /* optional — semantic plan may use testcase only */
  }

  return {
    testcase,
    testcaseFile: path.relative(process.cwd(), absolute),
    featureDir: path.relative(process.cwd(), featureDir),
    specFile,
    spec
  }
}

/**
 * @param {string} root workspace root
 * @param {string} moduleSlug e.g. admin/hotel, chain/hotel
 */
export async function listFeatureTestcases(root, moduleSlug) {
  const moduleDir = path.join(root, 'docs/features/yaml', moduleSlug)
  const files = []
  let entries = []

  try {
    entries = await readdir(moduleDir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue
    const fnDir = path.join(moduleDir, entry.name)
    const fnEntries = await readdir(fnDir, { withFileTypes: true })
    for (const f of fnEntries) {
      if (f.isFile() && /\.test\.ya?ml$/.test(f.name)) {
        files.push(path.join(fnDir, f.name))
      }
    }
    const tcDir = path.join(fnDir, 'testcases')
    try {
      const tcEntries = await readdir(tcDir, { withFileTypes: true })
      for (const t of tcEntries) {
        if (t.isFile() && t.name.endsWith('.yaml')) files.push(path.join(tcDir, t.name))
      }
    } catch {
      /* no testcases/ */
    }
  }

  return files.sort()
}
