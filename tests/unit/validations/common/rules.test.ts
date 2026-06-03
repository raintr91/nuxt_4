import { describe, expect, it } from 'vitest'
import { rules, composeString } from '~/validations/common/rules'

describe('validations/common/rules', () => {
  describe('required', () => {
    it('rejects empty string', () => {
      const schema = rules.required()
      const result = schema.safeParse('')
      expect(result.success).toBe(false)
    })

    it('accepts non-empty string', () => {
      const schema = rules.required()
      expect(schema.safeParse('hello').success).toBe(true)
    })

    it('uses custom message', () => {
      const schema = rules.required('custom msg')
      const result = schema.safeParse('')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('custom msg')
      }
    })
  })

  describe('maxLength', () => {
    it('rejects string exceeding max', () => {
      const schema = rules.maxLength(5)
      expect(schema.safeParse('123456').success).toBe(false)
    })

    it('accepts string within limit', () => {
      const schema = rules.maxLength(5)
      expect(schema.safeParse('12345').success).toBe(true)
    })

    it('uses custom message', () => {
      const schema = rules.maxLength(3, 'too long')
      const result = schema.safeParse('1234')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('too long')
      }
    })
  })

  describe('minLength', () => {
    it('rejects string below min', () => {
      const schema = rules.minLength(3)
      expect(schema.safeParse('ab').success).toBe(false)
    })

    it('accepts string at or above min', () => {
      const schema = rules.minLength(3)
      expect(schema.safeParse('abc').success).toBe(true)
    })

    it('uses custom message', () => {
      const schema = rules.minLength(5, 'too short')
      const result = schema.safeParse('ab')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('too short')
      }
    })
  })

  describe('email', () => {
    it('rejects invalid email', () => {
      const schema = rules.email()
      expect(schema.safeParse('notanemail').success).toBe(false)
    })

    it('accepts valid email', () => {
      const schema = rules.email()
      expect(schema.safeParse('user@example.com').success).toBe(true)
    })

    it('uses custom message', () => {
      const schema = rules.email('bad email')
      const result = schema.safeParse('bad')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('bad email')
      }
    })
  })

  describe('phone', () => {
    it('accepts empty string (optional)', () => {
      const schema = rules.phone()
      expect(schema.safeParse('').success).toBe(true)
    })

    it('accepts valid phone with country code', () => {
      const schema = rules.phone()
      expect(schema.safeParse('+1234567890').success).toBe(true)
    })

    it('normalizes and accepts phone with spaces/hyphens/parens', () => {
      const schema = rules.phone()
      expect(schema.safeParse('+1 (234) 567-8901').success).toBe(true)
    })

    it('rejects too short phone number', () => {
      const schema = rules.phone()
      expect(schema.safeParse('12345').success).toBe(false)
    })

    it('rejects phone with letters', () => {
      const schema = rules.phone()
      expect(schema.safeParse('123abc7890').success).toBe(false)
    })

    it('normalizes null/undefined to empty string', () => {
      const schema = rules.phone()
      expect(schema.safeParse(null).success).toBe(true)
      expect(schema.safeParse(undefined).success).toBe(true)
    })

    it('normalizes numeric input to string', () => {
      const schema = rules.phone()
      expect(schema.safeParse(1234567890).success).toBe(true)
    })

    it('uses custom message', () => {
      const schema = rules.phone('bad phone')
      const result = schema.safeParse('123')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('bad phone')
      }
    })
  })

  describe('composeString', () => {
    it('composes multiple string rules (min + max)', () => {
      const schema = composeString(rules.minLength(2), rules.maxLength(5))
      expect(schema.safeParse('a').success).toBe(false)
      expect(schema.safeParse('ab').success).toBe(true)
      expect(schema.safeParse('abcde').success).toBe(true)
      expect(schema.safeParse('abcdef').success).toBe(false)
    })
  })
})
