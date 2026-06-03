import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { rules } from '~/validations/common/rules'
import { authValidationMessages as m } from '~/validations/auth/messages'
import { commonValidationMessages as cm } from '~/validations/common/messages'

const email = rules.email(m.emailInvalid)
const password = z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))

const loginRaw = z.object({ email, password })

const registerRaw = z
  .object({
    name: z.string().optional(),
    email,
    password,
    password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: m.passwordMismatch,
    path: ['password_confirmation']
  })

const forgotPasswordRaw = z.object({ email })

const resetPasswordRaw = z
  .object({
    email,
    token: rules.required(m.tokenRequired),
    password,
    password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: m.passwordMismatch,
    path: ['password_confirmation']
  })

const changePasswordRaw = z
  .object({
    current_password: rules.required(m.currentPasswordRequired),
    password,
    password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: m.passwordMismatch,
    path: ['password_confirmation']
  })

describe('validations/auth/schemas', () => {
  describe('loginSchema', () => {
    it('accepts valid login', () => {
      const result = loginRaw.safeParse({ email: 'a@b.com', password: '12345678' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginRaw.safeParse({ email: 'bad', password: '12345678' })
      expect(result.success).toBe(false)
    })

    it('rejects short password', () => {
      const result = loginRaw.safeParse({ email: 'a@b.com', password: '1234' })
      expect(result.success).toBe(false)
    })

    it('rejects password exceeding 128 chars', () => {
      const result = loginRaw.safeParse({ email: 'a@b.com', password: 'x'.repeat(129) })
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    const valid = {
      name: 'Test',
      email: 'a@b.com',
      password: '12345678',
      password_confirmation: '12345678'
    }

    it('accepts valid registration', () => {
      expect(registerRaw.safeParse(valid).success).toBe(true)
    })

    it('accepts registration without name (optional)', () => {
      const { name: _, ...noName } = valid
      expect(registerRaw.safeParse(noName).success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
      const result = registerRaw.safeParse({ ...valid, password_confirmation: 'different' })
      expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
      expect(registerRaw.safeParse({ ...valid, email: 'bad' }).success).toBe(false)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('accepts valid email', () => {
      expect(forgotPasswordRaw.safeParse({ email: 'a@b.com' }).success).toBe(true)
    })

    it('rejects invalid email', () => {
      expect(forgotPasswordRaw.safeParse({ email: 'nope' }).success).toBe(false)
    })
  })

  describe('resetPasswordSchema', () => {
    const valid = {
      email: 'a@b.com',
      token: 'some-token',
      password: '12345678',
      password_confirmation: '12345678'
    }

    it('accepts valid reset', () => {
      expect(resetPasswordRaw.safeParse(valid).success).toBe(true)
    })

    it('rejects empty token', () => {
      expect(resetPasswordRaw.safeParse({ ...valid, token: '' }).success).toBe(false)
    })

    it('rejects mismatched passwords', () => {
      expect(resetPasswordRaw.safeParse({ ...valid, password_confirmation: 'mismatch1' }).success).toBe(false)
    })
  })

  describe('changePasswordSchema', () => {
    const valid = {
      current_password: 'oldpass12',
      password: 'newpass12',
      password_confirmation: 'newpass12'
    }

    it('accepts valid change', () => {
      expect(changePasswordRaw.safeParse(valid).success).toBe(true)
    })

    it('rejects empty current_password', () => {
      expect(changePasswordRaw.safeParse({ ...valid, current_password: '' }).success).toBe(false)
    })

    it('rejects mismatched passwords', () => {
      expect(changePasswordRaw.safeParse({ ...valid, password_confirmation: 'different' }).success).toBe(false)
    })
  })
})
