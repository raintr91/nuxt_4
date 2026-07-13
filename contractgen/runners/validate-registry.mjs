#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const registryPath = path.join(root, 'registries/contract-field.registry.json')

async function main() {
  const raw = await fs.readFile(registryPath, 'utf8')
  const registry = JSON.parse(raw)

  if (!registry.version || !registry.fieldKinds?.length) {
    throw new Error('Invalid contract-field.registry.json')
  }

  console.log(`contract-field.registry.json OK (v${registry.version})`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
