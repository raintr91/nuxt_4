import type { ForgotPasswordRequest } from '~/types/api/auth'
import { useAuthFormAction } from '~/composables/auth/useAuthFormAction'

export function useAuthForgotPasswordForm() {
  const auth = useAuth()

  return useAuthFormAction<ForgotPasswordRequest>({
    action: (values) => auth.forgotPassword(values),
    successMessageKey: 'auth.feedback.forgotPasswordSent',
    errorMessageKey: 'auth.feedback.submitFailed'
  })
}
