import fs from 'node:fs/promises'
import path from 'node:path'

import { serializeOpenApi } from './render.mjs'

export async function writeOpenApi(outputPath, document) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, serializeOpenApi(document), 'utf8')
}
