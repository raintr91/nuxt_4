import { navigateTo, useCookie } from 'nuxt/app'
import { ApiValidationError } from '~/utils/apiValidation'

export type ApiError = {
  success?: false
  message?: string
  user_message?: string
  errors?: Record<string, string[]>
}

export type ToastShow = (params: { message: string; title?: string; type?: 'info' | 'warning' | 'success' | 'error' }) => void

type PortalHeaders = {
  portalKey?: string
  serviceKey?: string
}

let isHandlingUnauthorized = false
const TECHNICAL_ERROR_LOG_ENDPOINT = '/api/internal/client-error'

function getRequestUrl(request?: Request | string) {
  if (!request) return ''
  return typeof request === 'string' ? request : request.url
}

/* c8 ignore start */
function logTechnicalError(payload: {
  context: string
  requestUrl?: string
  status?: number
  backendMessage?: string
  technicalMessage?: string
  stack?: string
}) {
  if (!import.meta.client) return
  void $fetch(TECHNICAL_ERROR_LOG_ENDPOINT, {
    method: 'POST',
    body: {
      portal: 'portal',
      occurredAt: new Date().toISOString(),
      ...payload
    }
  }).catch((err) => {
    if (import.meta.dev) console.warn('[logTechnicalError] failed to send', err)
  })
}
/* c8 ignore stop */

function toFriendlyErrorMessage(status?: number) {

  const fallbackByStatus: Record<number, string> = {
    400: 'リクエスト内容が不正です。入力内容をご確認ください。',
    401: 'セッションの有効期限が切れました。再度ログインしてください。',
    403: 'この操作を実行する権限がありません。',
    404: 'データが見つかりません。',
    409: 'データが競合しています。画面を再読み込みして再度お試しください。',
    422: '入力内容に不備があります。必須項目をご確認ください。',
    500: 'サーバー処理中にエラーが発生しました。（500）',
    502: 'サーバー処理中にエラーが発生しました。（502）',
    503: 'サーバー処理中にエラーが発生しました。（503）'
  }

  if (!status) return 'サーバーへ接続できません。ネットワークをご確認ください。'
  if (status >= 500) return `サーバー処理中にエラーが発生しました。（${status}）`

  const mapped = fallbackByStatus[status]
  if (mapped) return mapped
  return 'エラーが発生しました。しばらくしてから再度お試しください。'
}

function parseStatusFromErrorMessage(message?: string): number | undefined {
  if (!message) return undefined
  const matched = message.match(/\b([1-5]\d{2})\b/)
  if (!matched) return undefined
  const parsed = Number(matched[1])
  return Number.isFinite(parsed) ? parsed : undefined
}

export function getCommonFetchOptions(
  setErrors?: (errors: Record<string, string[]>) => void,
  showToast?: ToastShow,
  portalHeaders?: PortalHeaders
) {
  const token = useCookie<string | null>('auth_token')
  const refreshToken = useCookie<string | null>('refresh_token')
  const authUser = useCookie('auth_user')

  return {
    onRequest({ request, options }: { request: Request; options: any }) {
      const headers: Record<string, string> = {
        ...(options.headers || {})
      }
      const requestUrl = typeof request === 'string' ? request : request.url
      // Matches `/api/auth/...` and legacy `/api/<module>/auth/...`.
      const isAuthRequest = /\/api\/(?:[^/]+\/)?auth\//.test(requestUrl)
      const isPublicAuthRequest = [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-pass',
        '/auth/reset-pass'
      ].some((path) => requestUrl.includes(path))

      if (!isAuthRequest && portalHeaders?.portalKey) {
        headers['X-Portal-Key'] = portalHeaders.portalKey
      }
      if (!isAuthRequest && portalHeaders?.serviceKey) {
        headers['X-Service-Key'] = portalHeaders.serviceKey
      }
      // Never send stale bearer token to public auth endpoints such as login.
      if (token.value && !isPublicAuthRequest) {
        headers.Authorization = `Bearer ${token.value}`
      }

      options.headers = headers
      if (import.meta.dev) console.log('Request started:', request)
    },

    onRequestError({ request, error }: { request: Request; error: Error }) {
      if (showToast) {
        showToast({ message: toFriendlyErrorMessage(undefined), type: 'error', title: '通知' })
      }
      logTechnicalError({
        context: 'onRequestError',
        requestUrl: getRequestUrl(request),
        technicalMessage: error?.message,
        stack: error?.stack
      })
      if (import.meta.dev) console.error('Request error:', request, error)
    },

    onResponse({ request, response }: { request: Request; response: any }) {
      const data = response?._data?.data
      const nextToken = data?.token ?? data?.accessToken ?? response?._data?.token
      const nextRefreshToken = data?.refreshToken

      if (typeof nextToken === 'string' && nextToken.length > 0) {
        token.value = nextToken
      }
      if (typeof nextRefreshToken === 'string' && nextRefreshToken.length > 0) {
        refreshToken.value = nextRefreshToken
      }
      if (import.meta.dev) console.log('Response received:', request, response)
    },

    onResponseError({ request, response, error }: { request: Request | string; response: any; error?: Error }) {
      const fetchError = error as (Error & { response?: { status?: number; _data?: any }; data?: any }) | undefined
      const status = response?.status ?? fetchError?.response?.status ?? parseStatusFromErrorMessage(error?.message)
      const data = response?._data ?? fetchError?.response?._data ?? fetchError?.data
      const requestUrl = getRequestUrl(request)
      const errors = data?.errors
      const backendMessage = data?.message
      const backendUserMessage = typeof data?.user_message === 'string' ? data.user_message.trim() : ''

      logTechnicalError({
        context: 'onResponseError',
        requestUrl,
        status,
        backendMessage,
        technicalMessage: error?.message,
        stack: error?.stack
      })

      if (status === 401) {
        const isLoginRequest = requestUrl.includes('/auth/login')

        token.value = null
        refreshToken.value = null
        authUser.value = null

        if (isLoginRequest) {
          const loginMessage = backendUserMessage || backendMessage || 'ログインIDが見つかりません。メールアドレスをご確認ください。'
          throw new Error(loginMessage)
        }

        if (typeof window !== 'undefined' && !isHandlingUnauthorized) {
          isHandlingUnauthorized = true
          const message = 'Session het han hoac khong hop le. Bam OK hoac Close de quay ve trang dang nhap.'
          setTimeout(async () => {
            window.confirm(message)
            await navigateTo('/auth/login', { replace: true })
            isHandlingUnauthorized = false
          }, 0)
        }
        return
      }

      if (status === 422 && errors) {
        if (setErrors) setErrors(errors as Record<string, string[]>)
        throw new ApiValidationError(toFriendlyErrorMessage(status), errors as Record<string, string[]>, data)
      }
      const friendlyMessage = backendUserMessage || toFriendlyErrorMessage(status)
      if (error && typeof error === 'object' && 'message' in error) {
        ;(error as Error).message = friendlyMessage
      }
      if (showToast) {
        showToast({ message: friendlyMessage, type: 'error', title: '通知' })
      }

      if (import.meta.dev) {
        console.error('Response error:', {
          status,
          requestUrl: getRequestUrl(request),
          backendMessage,
          technicalMessage: error?.message
        })
      }

      throw new Error(friendlyMessage)
    }
  }
}
