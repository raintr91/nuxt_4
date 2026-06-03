import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { rules } from '~/validations/common/rules'
import { commonValidationMessages as cm } from '~/validations/common/messages'

const robotUpsertRaw = z.object({
  name: rules.required().max(255, cm.maxLength(255)),
  type: rules.required().max(255, cm.maxLength(255)),
  serial_number: rules.required().max(255, cm.maxLength(255)),
  status: z.coerce.number().int().min(0).max(1)
})

describe('validations/robot/schemas', () => {
  const valid = { name: 'Bot-1', type: 'ARM', serial_number: 'SN-001', status: 1 }

  it('accepts valid robot data', () => {
    expect(robotUpsertRaw.safeParse(valid).success).toBe(true)
  })

  it('rejects empty name', () => {
    expect(robotUpsertRaw.safeParse({ ...valid, name: '' }).success).toBe(false)
  })

  it('rejects empty type', () => {
    expect(robotUpsertRaw.safeParse({ ...valid, type: '' }).success).toBe(false)
  })

  it('rejects empty serial_number', () => {
    expect(robotUpsertRaw.safeParse({ ...valid, serial_number: '' }).success).toBe(false)
  })

  it('rejects name exceeding 255 chars', () => {
    expect(robotUpsertRaw.safeParse({ ...valid, name: 'x'.repeat(256) }).success).toBe(false)
  })

  it('rejects status outside 0-1 range', () => {
    expect(robotUpsertRaw.safeParse({ ...valid, status: 2 }).success).toBe(false)
    expect(robotUpsertRaw.safeParse({ ...valid, status: -1 }).success).toBe(false)
  })

  it('coerces string status to number', () => {
    expect(robotUpsertRaw.safeParse({ ...valid, status: '1' }).success).toBe(true)
  })

  it('accepts status 0', () => {
    expect(robotUpsertRaw.safeParse({ ...valid, status: 0 }).success).toBe(true)
  })
})
