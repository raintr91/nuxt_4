import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { authValidationMessages as m } from '~/validations/auth/messages'
import { rules } from '~/validations/common/rules'
import { commonValidationMessages as cm } from '~/validations/common/messages'

const email = rules.email(m.emailInvalid)
const password = z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))
const passwordConfirmation = z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))

function withPasswordConfirmation<T extends z.ZodRawShape>(shape: T) {
  return z
    .object({ ...shape, password, password_confirmation: passwordConfirmation })
    .refine((v) => v.password === v.password_confirmation, {
      message: m.passwordMismatch,
      path: ['password_confirmation']
    })
}

export const loginSchema = toTypedSchema(
  z.object({
    email,
    password
  })
)

export const registerSchema = toTypedSchema(
  withPasswordConfirmation({
    name: z.string().optional(),
    email
  })
)

export const forgotPasswordSchema = toTypedSchema(
  z.object({
    email
  })
)

export const resetPasswordSchema = toTypedSchema(
  withPasswordConfirmation({
    email,
    token: rules.required(m.tokenRequired)
  })
)

export const changePasswordSchema = toTypedSchema(
  withPasswordConfirmation({
    current_password: rules.required(m.currentPasswordRequired)
  })
)

// Backward-compatible wrapper (older imports can keep using this)
export function useAuthSchemas() {
  return {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
  }
}
