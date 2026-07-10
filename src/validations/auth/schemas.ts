import { z } from 'zod';
import { LoginRequestSchema } from '@portal/models/auth';
import { authValidationMessages as m } from '@/validations/auth/messages';
import { rules } from '@/validations/common/rules';
import { commonValidationMessages as cm } from '@/validations/common/messages';

const email = rules.email(m.emailInvalid);
const password = z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128));

/** Strict form validation (portal validations layer). */
export const loginFormSchema = z.object({
  email,
  password,
});

/** API contract — re-export from models. */
export { LoginRequestSchema };

export const registerFormSchema = z
  .object({
    name: z.string().optional(),
    email,
    password,
    password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128)),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: m.passwordMismatch,
    path: ['password_confirmation'],
  });

export const forgotPasswordFormSchema = z.object({ email });

export const resetPasswordFormSchema = z
  .object({
    email,
    token: rules.required(m.tokenRequired),
    password,
    password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128)),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: m.passwordMismatch,
    path: ['password_confirmation'],
  });

export const changePasswordFormSchema = z
  .object({
    current_password: rules.required(m.currentPasswordRequired),
    password,
    password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128)),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: m.passwordMismatch,
    path: ['password_confirmation'],
  });
