import type { z } from 'zod'

import type {
  KnowledgeCitationSchema,
  KnowledgeQueryDataSchema,
  KnowledgeQueryRequestSchema,
} from './knowledge-hub.schema.js'
import {
  KnowledgeQueryListResponseSchema,
  KnowledgeQueryReadSchema,
} from './knowledge-hub.read.schema.js'
import type { KnowledgeQueryWriteSchema } from './knowledge-hub.write.schema.js'

export type KnowledgeCitation = z.infer<typeof KnowledgeCitationSchema>
export type KnowledgeQuery = z.infer<typeof KnowledgeQueryReadSchema>
export type KnowledgeQueryListResponse = z.infer<typeof KnowledgeQueryListResponseSchema>
export type KnowledgeQueryCreateRequest = z.infer<typeof KnowledgeQueryWriteSchema>
export type KnowledgeQueryRequest = z.infer<typeof KnowledgeQueryRequestSchema>
export type KnowledgeQueryData = z.infer<typeof KnowledgeQueryDataSchema>
