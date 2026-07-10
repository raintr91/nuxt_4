import { z } from 'zod'

import { fields } from '../common/fields.js'

export const WorkforceCheckInReadSchema = z.object({
  checked_in: z.boolean(),
  employee_name: fields.optionalNullableString,
  shift_id: fields.optionalNullableString.nullable(),
})

export const WorkforceCheckInListSchema = z.array(WorkforceCheckInReadSchema)

export const WorkforceCheckInListResponseSchema = z.object({
  items: WorkforceCheckInListSchema,
  total: z.number().optional()
})
