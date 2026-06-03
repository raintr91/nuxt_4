import type { ChangePasswordRequest } from '~/types/api/auth'
import { useAuthFormAction } from '~/composables/auth/useAuthFormAction'

export function useAuthChangePasswordForm() {
  const auth = useAuth()

  return useAuthFormAction<ChangePasswordRequest>({
    action: (values) => auth.changePassword(values),
    successMessageKey: 'auth.feedback.passwordChanged',
    errorMessageKey: 'auth.feedback.changeFailed'
  })
}
