import type { RegisterRequest } from '~/types/api/auth'
import { useAuthFormAction } from '~/composables/auth/useAuthFormAction'

export function useAuthRegisterForm() {
  const auth = useAuth()

  return useAuthFormAction<RegisterRequest>({
    action: (values) => auth.register(values),
    errorMessageKey: 'auth.feedback.registerFailed',
    onSuccess: () => navigateTo('/')
  })
}
