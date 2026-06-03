import type { LoginRequest } from '~/types/api/auth'
import { isApiValidationError } from '~/utils/apiValidation'

export function useAuthLoginForm() {
  const route = useRoute()
  const auth = useAuth()
  const { t } = useI18n()

  const apiError = ref<string | null>(null)

  const isSubmitting = ref(false)

  const onSubmit = async (values: LoginRequest) => {
    apiError.value = null
    try {
      isSubmitting.value = true
      await auth.login(values)
      const raw = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      const redirect = (raw.startsWith('/') && !raw.startsWith('//')) ? raw : '/'
      await navigateTo(redirect)
    } catch (e: any) {
      if (isApiValidationError(e)) throw e
      apiError.value = e?.message ?? t('auth.feedback.loginFailed')
      throw e
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    apiError,
    isSubmitting,
    onSubmit
  }
}
