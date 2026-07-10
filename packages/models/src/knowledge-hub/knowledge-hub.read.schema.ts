import { z } from 'zod'

import { fields } from '../common/fields.js'

export const KnowledgeQueryReadSchema = z.object({
  answer: fields.optionalNullableString,
  citations: z.array(z.object({
  source: fields.optionalNullableString,
  excerpt: fields.optionalNullableString,
  page: z.number().int().nullable(),
})),
})

export const KnowledgeQueryListSchema = z.array(KnowledgeQueryReadSchema)

export const KnowledgeQueryListResponseSchema = z.object({
  items: KnowledgeQueryListSchema,
  total: z.number().optional()
})
