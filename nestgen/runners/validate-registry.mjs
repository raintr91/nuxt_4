#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const registryPath = path.join(root, 'registries/nest-codegen.registry.json')

async function main() {
  const raw = await fs.readFile(registryPath, 'utf8')
  const registry = JSON.parse(raw)
  if (!registry.version) throw new Error('Invalid nest-codegen.registry.json')
  console.log(`nest-codegen.registry.json OK (v${registry.version})`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
