#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  demotePageLifecycle,
  syncPageLifecycleFromManifests,
  upsertPageLifecycle
} from '../codegen/runners/lib/page-lifecycle.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const STAGES = new Set(['design-spec', 'prototype', 'test', 'wire'])

async function main() {
  const [command, routePath, stage, ...rest] = process.argv.slice(2)

  if (command === 'sync') {
    const result = await syncPageLifecycleFromManifests(root)
    console.log(`portal:lifecycle: sync — ${result.manifests} manifest(s), ${result.updated} route(s)`)
    return
  }

  if (command === 'set') {
    if (!routePath || !stage || !STAGES.has(stage)) {
      throw new Error(
        'Usage: pnpm portal:lifecycle set <path> <design-spec|prototype|test|wire> [--spec path] [--title text] [--force]'
      )
    }

    let specFile
    let title
    let force = false
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === '--spec') specFile = rest[++i]
      else if (rest[i] === '--title') title = rest[++i]
      else if (rest[i] === '--force') force = true
    }

    const result = await upsertPageLifecycle(root, {
      routePath,
      stage,
      specFile: specFile ?? 'manual',
      title,
      allowDowngrade: force || stage === 'design-spec'
    })
    console.log(`portal:lifecycle: ${result.routePath} → ${result.stage}`)
    return
  }

  console.log(`Usage:
  pnpm portal:lifecycle sync
  pnpm portal:lifecycle set /hotels test [--spec docs/.../spec.yaml] [--force]

Registry: registries/page-lifecycle.registry.json
Remove code: pnpm portal:remove --spec <spec.yaml>`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
