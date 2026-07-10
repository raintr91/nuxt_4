import { z } from 'zod'

export const KnowledgeCitationSchema = z.object({
  source: z.string(),
  excerpt: z.string(),
  page: z.number().nullable().optional(),
})

export const KnowledgeQueryRequestSchema = z.object({
  query: z.string().min(1),
  plant_id: z.number().int().nullable().optional(),
})

export const KnowledgeQueryDataSchema = z.object({
  answer: z.string(),
  citations: z.array(KnowledgeCitationSchema),
})
