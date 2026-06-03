import type { ResetPasswordRequest } from '~/types/api/auth'
import { useAuthFormAction } from '~/composables/auth/useAuthFormAction'

export function useAuthResetPasswordForm() {
  const auth = useAuth()

  return useAuthFormAction<ResetPasswordRequest>({
    action: (values) => auth.resetPassword(values),
    successMessageKey: 'auth.feedback.passwordUpdated',
    errorMessageKey: 'auth.feedback.updateFailed',
    onSuccess: () => navigateTo('/auth/login')
  })
}
