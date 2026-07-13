import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseArgs, readSpecFile } from '../nest-gen/lib/read-spec.mjs'
import { resolveCodegenContext } from '../nest-gen/lib/plan.mjs'
import { buildOpenApiDocument } from './lib/render.mjs'
import { writeOpenApi } from './lib/write-files.mjs'

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const { spec, specFile, featureDir } = await readSpecFile(options.spec)
  const ctx = resolveCodegenContext(spec)
  const document = buildOpenApiDocument(spec, ctx)
  const outputPath = path.join(featureDir, 'backend', '02-openapi.yaml')

  if (options.dryRun) {
    console.log(`openapi-gen: dry-run ${path.relative(repoRoot, outputPath)}`)
    console.log(`  paths: ${Object.keys(document.paths ?? {}).join(', ') || '(none)'}`)
    return
  }

  await writeOpenApi(outputPath, document)
  console.log(`openapi-gen: ${ctx.module}/${ctx.entity}`)
  console.log(`  write: ${path.relative(repoRoot, outputPath)}`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
