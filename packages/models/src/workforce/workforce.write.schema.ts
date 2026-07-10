import { z } from 'zod'

import { fields } from '../common/fields.js'

export const WorkforceCheckInWriteSchema = z.object({
  badge_id: fields.optionalNullableString,
  station_id: fields.optionalNullableString.nullable(),
  plant_id: z.number().int().nullable(),
})

export const WorkforceCheckInCreateRequestSchema = WorkforceCheckInWriteSchema
