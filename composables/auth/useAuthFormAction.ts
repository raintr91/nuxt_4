import { isApiValidationError } from '~/utils/apiValidation'

export type AuthFormActionOptions<T> = {
  action: (values: T) => Promise<unknown>
  successMessageKey?: string
  errorMessageKey: string
  onSuccess?: () => void | Promise<void>
}

export function useAuthFormAction<T>(options: AuthFormActionOptions<T>) {
  const { t } = useI18n()

  const apiError = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const isSubmitting = ref(false)

  const onSubmit = async (values: T) => {
    apiError.value = null
    successMessage.value = null

    try {
      isSubmitting.value = true
      await options.action(values)
      if (options.successMessageKey) {
        successMessage.value = t(options.successMessageKey)
      }
      await options.onSuccess?.()
    } catch (e: unknown) {
      if (isApiValidationError(e)) throw e
      const err = e as { message?: string } | null
      apiError.value = err?.message ?? t(options.errorMessageKey)
      throw e
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    apiError,
    successMessage,
    isSubmitting,
    onSubmit
  }
}
