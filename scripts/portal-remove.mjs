#!/usr/bin/env node
import { rm, readFile, writeFile, mkdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  demotePageLifecycle,
  routePathFromPageFile,
  syncPageLifecycleFromManifests
} from '../codegen/runners/lib/page-lifecycle.mjs'
import { readSpecFile } from '../codegen/runners/lib/read-spec.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseArgs(argv) {
  const options = { dryRun: false, spec: null, route: null }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run' || arg === '--dry') options.dryRun = true
    else if (arg === '--spec') options.spec = argv[++i]
    else if (arg === '--route') options.route = argv[++i]
    else if (!arg.startsWith('-') && !options.spec) options.spec = arg
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (!options.spec && !options.route) {
    throw new Error(
      'Usage: pnpm portal:remove --spec docs/features/.../ir/spec.yaml [--dry-run]\n' +
        '       pnpm portal:remove --route /hotels [--dry-run]'
    )
  }

  const { specFile, featureDir } = options.spec
    ? await readSpecFile(options.spec)
    : await resolveSpecFromRoute(root, options.route)

  const manifestPath = path.join(featureDir, 'generated', 'codegen.manifest.json')
  let manifest

  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch {
    throw new Error(
      `Không tìm thấy ${path.relative(root, manifestPath)}. Chạy portal:gen trước hoặc chỉ định --spec đúng.`
    )
  }

  const pathsToDelete = collectPathsFromManifest(manifest)
  const pageEntry = manifest.files?.find((f) => f.layer === 'page')
  const routePath =
    options.route ?? (pageEntry ? routePathFromPageFile(pageEntry.path) : null) ?? manifest.uiRoute

  if (!routePath) {
    throw new Error('Không xác định được route — thêm --route /path')
  }

  console.log(`portal:remove: spec=${specFile}`)
  console.log(`  route: ${routePath}`)
  console.log(`  mode: ${options.dryRun ? 'dry-run' : 'delete'}`)

  for (const relativePath of pathsToDelete) {
    const absolute = path.join(root, relativePath)
    if (options.dryRun) {
      console.log(`  [dry] delete: ${relativePath}`)
      continue
    }

    try {
      await rm(absolute, { force: true })
      console.log(`  delete: ${relativePath}`)
    } catch (error) {
      console.warn(`  skip: ${relativePath} (${error.message ?? error})`)
    }
  }

  if (!options.dryRun) {
    await pruneEmptyDirs(root, pathsToDelete)
    await writeRemovalHandoff(featureDir, specFile, routePath, pathsToDelete)
    await rm(manifestPath, { force: true })

    const lifecycle = await demotePageLifecycle(root, routePath, {
      specFile,
      note: 'Prototype code removed via portal:remove.'
    })
    console.log(`  lifecycle: ${lifecycle.routePath} → ${lifecycle.stage}`)
    await syncPageLifecycleFromManifests(root)
    runDocsRender()
  } else {
    console.log(`  lifecycle: would demote ${routePath} → design-spec`)
  }
}

/**
 * @param {Record<string, unknown>} manifest
 */
function collectPathsFromManifest(manifest) {
  const paths = new Set()

  for (const file of manifest.files ?? []) {
    if (file.path) paths.add(file.path.replace(/\\/g, '/'))
  }

  for (const info of Object.values(manifest.componentFiles ?? {})) {
    if (info?.path) paths.add(info.path.replace(/\\/g, '/'))
    if (info?.stubPath && info.stubPath !== info.path) {
      paths.add(info.stubPath.replace(/\\/g, '/'))
    }
  }

  return [...paths].sort()
}

async function pruneEmptyDirs(root, deletedPaths) {
  const dirs = new Set(
    deletedPaths.map((p) => path.dirname(p)).filter((d) => d && d !== '.')
  )

  for (const dir of [...dirs].sort((a, b) => b.length - a.length)) {
    const absolute = path.join(root, dir)
    try {
      const { readdir } = await import('node:fs/promises')
      const left = await readdir(absolute)
      if (left.length === 0) {
        await rm(absolute, { recursive: true, force: true })
        console.log(`  rmdir: ${dir}`)
      }
    } catch {
      // already gone
    }
  }
}

async function writeRemovalHandoff(featureDir, specFile, routePath, deletedPaths) {
  const handoffPath = path.join(featureDir, 'generated', 'HANDOFF.md')
  await mkdir(path.dirname(handoffPath), { recursive: true })

  const lines = [
    '# HANDOFF — prototype removed',
    '',
    `Removed at: ${new Date().toISOString()}`,
    `Spec: \`${specFile}\``,
    `Route: \`${routePath}\``,
    `Lifecycle: \`design-spec\` (chưa có prototype)`,
    '',
    '## Deleted files',
    '',
    ...deletedPaths.map((p) => `- \`${p}\``),
    '',
    '## Restore',
    '',
    '```bash',
    `pnpm portal:gen --spec ${specFile} --force`,
    '```',
    ''
  ]

  await writeFile(handoffPath, lines.join('\n'), 'utf8')
  console.log(`  handoff: ${path.relative(root, handoffPath)}`)
}

async function resolveSpecFromRoute(root, route) {
  const { readFile: rf } = await import('node:fs/promises')
  const registry = JSON.parse(await rf(path.join(root, 'registries/page-lifecycle.registry.json'), 'utf8'))
  const normalized = route.startsWith('/') ? route.replace(/\/$/, '') || '/' : `/${route}`
  const entry = registry.routes[normalized]

  if (!entry?.spec || entry.spec === 'manual') {
    throw new Error(`Route ${normalized} không có spec trong registry. Dùng --spec.`)
  }

  return readSpecFile(entry.spec)
}

function runDocsRender() {
  const script = path.join(root, 'scripts/docs/render-docs.mjs')
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'pipe', encoding: 'utf8' })
  if (result.status === 0) {
    console.log('  docs:render: ok')
  }
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
