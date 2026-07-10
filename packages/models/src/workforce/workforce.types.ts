import type { z } from 'zod'

import {
  WorkforceCheckInListResponseSchema,
  WorkforceCheckInReadSchema
} from './workforce.read.schema.js'
import type { WorkforceCheckInWriteSchema } from './workforce.write.schema.js'

export type WorkforceCheckIn = z.infer<typeof WorkforceCheckInReadSchema>
export type WorkforceCheckInListResponse = z.infer<typeof WorkforceCheckInListResponseSchema>
export type WorkforceCheckInCreateRequest = z.infer<typeof WorkforceCheckInWriteSchema>
