export const commonValidationMessages = {
  required: 'This field is required',
  emailInvalid: 'Email format is invalid',
  maxLength: (n: number) => `Must be at most ${n} characters`,
  minLength: (n: number) => `Must be at least ${n} characters`,
  phoneInvalid: 'Phone number format is invalid',
} as const;
