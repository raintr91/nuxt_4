#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

async function main() {
  const raw = await fs.readFile(path.join(root, 'registries/nest-unit-test.registry.json'), 'utf8')
  JSON.parse(raw)
  console.log('nest-unit-test.registry.json OK')
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
