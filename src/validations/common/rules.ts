import { z } from 'zod';
import { commonValidationMessages as m } from '@/validations/common/messages';

function normalizeToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export const rules = {
  required: (message: string = m.required) => z.string().min(1, message),
  maxLength: (max: number, message: string = m.maxLength(max)) => z.string().max(max, message),
  minLength: (min: number, message: string = m.minLength(min)) => z.string().min(min, message),
  email: (message: string = m.emailInvalid) => z.string().email(message),
  phone: (message: string = m.phoneInvalid) =>
    z
      .preprocess((v) => normalizeToString(v).replace(/[\s\-()]/g, ''), z.string())
      .refine((v) => v.length === 0 || /^\+?\d{9,15}$/.test(v), message),
} as const;
