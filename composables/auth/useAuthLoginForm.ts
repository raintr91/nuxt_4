import type { LoginRequest } from '~/types/api/auth'
import { useAuthFormAction } from '~/composables/auth/useAuthFormAction'

export function useAuthLoginForm() {
  const route = useRoute()
  const auth = useAuth()

  return useAuthFormAction<LoginRequest>({
    action: (values) => auth.login(values),
    errorMessageKey: 'auth.feedback.loginFailed',
    onSuccess: async () => {
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      await navigateTo(redirect)
    }
  })
}
