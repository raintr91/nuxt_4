import { z } from 'zod'

import { fields } from '../common/fields.js'

export const KnowledgeQueryWriteSchema = z.object({
  query: fields.optionalNullableString,
  plant_id: z.number().int().nullable(),
})

export const KnowledgeQueryCreateRequestSchema = KnowledgeQueryWriteSchema
