import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { getCommonFetchOptions } from '~/utils/fetchUtils'
import { ApiValidationError } from '~/utils/apiValidation'

const { cookieState, navigateToMock } = vi.hoisted(() => ({
  cookieState: {
    auth_token: { value: null as string | null },
    refresh_token: { value: null as string | null },
    auth_user: { value: null as any }
  } as Record<string, { value: any }>,
  navigateToMock: vi.fn()
}))

vi.mock('nuxt/app', () => ({
  useCookie: (name: string) => cookieState[name] ?? { value: null },
  navigateTo: navigateToMock
}))

describe('utils/fetchUtils', () => {
  beforeEach(() => {
    cookieState.auth_token.value = null
    cookieState.refresh_token.value = null
    cookieState.auth_user.value = null
    navigateToMock.mockReset()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    if (typeof window !== 'undefined') {
      ;(window as any).confirm = vi.fn(() => true)
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe('getCommonFetchOptions', () => {
    it('returns onRequest, onRequestError, onResponse, onResponseError', () => {
      const opts = getCommonFetchOptions()
      expect(opts).toHaveProperty('onRequest')
      expect(opts).toHaveProperty('onRequestError')
      expect(opts).toHaveProperty('onResponse')
      expect(opts).toHaveProperty('onResponseError')
    })

    describe('onRequest', () => {
      it('does not add Authorization when token is null', () => {
        cookieState.auth_token.value = null
        const opts = getCommonFetchOptions()
        const options: Record<string, unknown> = { headers: {} }
        opts.onRequest!({ request: new Request('https://x'), options } as any)
        expect(options.headers).toEqual({})
      })

      it('adds Bearer Authorization when token exists', () => {
        cookieState.auth_token.value = 'my-token'
        const opts = getCommonFetchOptions()
        const options: Record<string, unknown> = {}
        opts.onRequest!({ request: new Request('https://x'), options } as any)
        expect(options.headers).toEqual({
          Authorization: 'Bearer my-token'
        })
      })

      it('merges with existing headers', () => {
        cookieState.auth_token.value = 't'
        const opts = getCommonFetchOptions()
        const options: Record<string, unknown> = { headers: { 'X-Custom': 'y' } }
        opts.onRequest!({ request: new Request('https://x'), options } as any)
        expect(options.headers).toEqual({
          'X-Custom': 'y',
          Authorization: 'Bearer t'
        })
      })

      it('adds portal and service key headers when provided', () => {
        const opts = getCommonFetchOptions(undefined, undefined, {
          portalKey: 'portal',
          serviceKey: 'PORTAL'
        })
        const options: Record<string, unknown> = { headers: {} }
        opts.onRequest!({ request: new Request('https://x'), options } as any)
        expect(options.headers).toEqual({
          'X-Portal-Key': 'portal',
          'X-Service-Key': 'PORTAL'
        })
      })

      it('does not inject portal/service headers for auth endpoints', () => {
        const opts = getCommonFetchOptions(undefined, undefined, {
          portalKey: 'portal',
          serviceKey: 'PORTAL'
        })
        const options: Record<string, unknown> = { headers: {} }
        opts.onRequest!({ request: new Request('https://x/api/auth/login'), options } as any)
        expect(options.headers).toEqual({})
      })

      it('supports string request values in onRequest', () => {
        const opts = getCommonFetchOptions(undefined, undefined, {
          portalKey: 'portal',
          serviceKey: 'PORTAL'
        })
        const options: Record<string, unknown> = { headers: {} }
        opts.onRequest!({ request: 'https://x/api/users', options } as any)
        expect(options.headers).toEqual({
          'X-Portal-Key': 'portal',
          'X-Service-Key': 'PORTAL'
        })
      })
    })

    describe('onRequestError', () => {
      it('logs request errors', () => {
        const opts = getCommonFetchOptions()
        const err = new Error('network')
        opts.onRequestError!({ request: new Request('https://x'), error: err } as any)
        expect(console.error).toHaveBeenCalled()
      })

      it('shows fallback toast message when showToast is provided', () => {
        const showToast = vi.fn()
        const opts = getCommonFetchOptions(undefined, showToast)
        const err = new Error('network')
        opts.onRequestError!({ request: new Request('https://x'), error: err } as any)

        expect(showToast).toHaveBeenCalledWith({
          message: 'サーバーへ接続できません。ネットワークをご確認ください。',
          type: 'error',
          title: '通知'
        })
      })
    })

    describe('onResponse', () => {
      it('sets cookie when response has data.token', () => {
        const opts = getCommonFetchOptions()
        const response = { _data: { token: 'new-token' } }
        opts.onResponse!({ request: new Request('https://x'), response } as any)
        expect(cookieState.auth_token.value).toBe('new-token')
      })

      it('sets cookie when response has data.data.token', () => {
        cookieState.auth_token.value = null
        const opts = getCommonFetchOptions()
        const response = { _data: { data: { token: 'nested-token' } } }
        opts.onResponse!({ request: new Request('https://x'), response } as any)
        expect(cookieState.auth_token.value).toBe('nested-token')
      })

      it('sets accessToken + refreshToken when response has data.accessToken', () => {
        const opts = getCommonFetchOptions()
        const response = { _data: { data: { accessToken: 'acc-1', refreshToken: 'ref-1' } } }
        opts.onResponse!({ request: new Request('https://x'), response } as any)
        expect(cookieState.auth_token.value).toBe('acc-1')
        expect(cookieState.refresh_token.value).toBe('ref-1')
      })

      it('does not set cookie for empty or non-string token', () => {
        cookieState.auth_token.value = 'old'
        const opts = getCommonFetchOptions()
        opts.onResponse!({
          request: new Request('https://x'),
          response: { _data: { token: '' } }
        } as any)
        expect(cookieState.auth_token.value).toBe('old')

        opts.onResponse!({
          request: new Request('https://x'),
          response: { _data: { token: 123 } }
        } as any)
        expect(cookieState.auth_token.value).toBe('old')
      })
    })

    describe('onResponseError', () => {
      it('clears auth cookies and handles 401 redirect flow', async () => {
        vi.useFakeTimers()
        cookieState.auth_token.value = 'token-1'
        cookieState.refresh_token.value = 'refresh-1'
        cookieState.auth_user.value = { id: 1 }

        const opts = getCommonFetchOptions()
        opts.onResponseError!({ response: { status: 401, _data: {} } } as any)

        expect(cookieState.auth_token.value).toBeNull()
        expect(cookieState.refresh_token.value).toBeNull()
        expect(cookieState.auth_user.value).toBeNull()

        await vi.runAllTimersAsync()
        await nextTick()
        vi.useRealTimers()
      })

      it('skips redirect setup on second 401 while first is being handled', async () => {
        vi.useFakeTimers()
        cookieState.auth_token.value = 'token-x'
        cookieState.refresh_token.value = 'refresh-x'
        cookieState.auth_user.value = { id: 2 }

        const opts = getCommonFetchOptions()
        // First 401 — sets isHandlingUnauthorized = true
        opts.onResponseError!({ response: { status: 401, _data: {} } } as any)
        // Second 401 — guard should prevent duplicate redirect
        opts.onResponseError!({ response: { status: 401, _data: {} } } as any)

        // cookies are cleared
        expect(cookieState.auth_token.value).toBeNull()

        // finish timers to reset module state
        await vi.runAllTimersAsync()
        await nextTick()
        vi.useRealTimers()
      })

      it('calls setErrors and throws ApiValidationError on 422 with errors', () => {
        const setErrors = vi.fn()
        const opts = getCommonFetchOptions(setErrors)
        const response = {
          status: 422,
          _data: { message: 'Invalid', errors: { email: ['Invalid email'] } }
        }

        expect(() => {
          opts.onResponseError!({ response } as any)
        }).toThrow(ApiValidationError)

        expect(setErrors).toHaveBeenCalledWith({ email: ['Invalid email'] })
        try {
          opts.onResponseError!({ response } as any)
        } catch (e) {
          expect(e).toBeInstanceOf(ApiValidationError)
          expect((e as ApiValidationError).message).toBe('入力内容に不備があります。必須項目をご確認ください。')
          expect((e as ApiValidationError).errors).toEqual({ email: ['Invalid email'] })
        }
      })

      it('does not call setErrors when not provided on 422', () => {
        const opts = getCommonFetchOptions()
        const response = {
          status: 422,
          _data: { errors: { x: ['Err'] } }
        }
        expect(() => opts.onResponseError!({ response } as any)).toThrow(ApiValidationError)
      })

      it('throws friendly message when status is not 422', () => {
        const opts = getCommonFetchOptions()
        const response = { status: 500, _data: {} }
        expect(() => opts.onResponseError!({ response } as any)).toThrow('サーバー処理中にエラーが発生しました。（500）')
      })

      it('throws friendly message when 422 but no errors in body', () => {
        const opts = getCommonFetchOptions()
        const response = { status: 422, _data: {} }
        expect(() => opts.onResponseError!({ response } as any)).toThrow('入力内容に不備があります。必須項目をご確認ください。')
      })

      it('calls showToast on non-422 error when provided', () => {
        const showToast = vi.fn()
        const opts = getCommonFetchOptions(undefined, showToast)
        const response = { status: 500, _data: { message: 'Server error' } }
        expect(() => opts.onResponseError!({ response } as any)).toThrow('サーバー処理中にエラーが発生しました。（500）')
        expect(showToast).toHaveBeenCalledWith({ message: 'サーバー処理中にエラーが発生しました。（500）', type: 'error', title: '通知' })
      })

      it('calls showToast with status text when response has no message', () => {
        const showToast = vi.fn()
        const opts = getCommonFetchOptions(undefined, showToast)
        const response = { status: 503, _data: {} }
        expect(() => opts.onResponseError!({ response } as any)).toThrow('サーバー処理中にエラーが発生しました。（503）')
        expect(showToast).toHaveBeenCalledWith({
          message: 'サーバー処理中にエラーが発生しました。（503）',
          type: 'error',
          title: '通知'
        })
      })

      it('hides technical backend message and falls back by status', () => {
        const showToast = vi.fn()
        const opts = getCommonFetchOptions(undefined, showToast)
        const response = { status: 500, _data: { message: 'TypeError: Cannot read path' } }
        expect(() => opts.onResponseError!({ request: 'https://x/api/users', response } as any)).toThrow('サーバー処理中にエラーが発生しました。（500）')
        expect(showToast).toHaveBeenCalledWith({
          message: 'サーバー処理中にエラーが発生しました。（500）',
          type: 'error',
          title: '通知'
        })
      })

      it('uses generic fallback for unknown status codes without message', () => {
        const showToast = vi.fn()
        const opts = getCommonFetchOptions(undefined, showToast)
        const response = { status: 418, _data: {} }
        expect(() => opts.onResponseError!({ response } as any)).toThrow('エラーが発生しました。しばらくしてから再度お試しください。')
        expect(showToast).toHaveBeenCalledWith({
          message: 'エラーが発生しました。しばらくしてから再度お試しください。',
          type: 'error',
          title: '通知'
        })
      })

      it('throws on non-422 status (dev-only console logging)', () => {
        const opts = getCommonFetchOptions()
        const response = { status: 500, _data: {} }
        const error = new Error('server')
        expect(() => opts.onResponseError!({ response, error } as any)).toThrow('サーバー処理中にエラーが発生しました。（500）')
      })

      it('rewrites technical error message to friendly Japanese text for 5xx', () => {
        const opts = getCommonFetchOptions()
        const response = { status: 500, _data: { message: '[GET] "/api/reports/list": 500 Internal Server Error' } }
        const error = new Error('[GET] "/api/reports/list": 500 Internal Server Error')

        try {
          opts.onResponseError!({ response, error } as any)
        } catch {
          // expected throw after mutating error.message
        }

        expect(error.message).toBe('サーバー処理中にエラーが発生しました。（500）')
      })

      it('parses status from error message when response has no status', () => {
        const opts = getCommonFetchOptions()
        const error = new Error('fetch failed with 500 error')
        expect(() => opts.onResponseError!({ response: { _data: {} }, error } as any)).toThrow(
          'サーバー処理中にエラーが発生しました。（500）'
        )
      })

      it('falls back to network error when no status anywhere', () => {
        const opts = getCommonFetchOptions()
        const error = new Error('network timeout')
        expect(() => opts.onResponseError!({ response: { _data: {} }, error } as any)).toThrow(
          'サーバーへ接続できません。ネットワークをご確認ください。'
        )
      })

      it('throws login-specific message on 401 for login request', () => {
        cookieState.auth_token.value = 'tok'
        const opts = getCommonFetchOptions()
        expect(() =>
          opts.onResponseError!({
            request: 'https://x/api/auth/login',
            response: { status: 401, _data: { message: 'Invalid credentials' } }
          } as any)
        ).toThrow('Invalid credentials')
      })

      it('throws default login message on 401 for login request without backend message', () => {
        cookieState.auth_token.value = 'tok'
        const opts = getCommonFetchOptions()
        expect(() =>
          opts.onResponseError!({
            request: 'https://x/api/auth/login',
            response: { status: 401, _data: {} }
          } as any)
        ).toThrow('ログインIDが見つかりません。メールアドレスをご確認ください。')
      })

      it('uses user_message from backend when available', () => {
        cookieState.auth_token.value = 'tok'
        const opts = getCommonFetchOptions()
        expect(() =>
          opts.onResponseError!({
            request: 'https://x/api/auth/login',
            response: { status: 401, _data: { user_message: 'Custom user msg', message: 'Technical' } }
          } as any)
        ).toThrow('Custom user msg')
      })

      it('uses user_message for non-422 errors instead of status fallback', () => {
        const showToast = vi.fn()
        const opts = getCommonFetchOptions(undefined, showToast)
        expect(() =>
          opts.onResponseError!({
            response: { status: 403, _data: { user_message: 'No access' } }
          } as any)
        ).toThrow('No access')
        expect(showToast).toHaveBeenCalledWith({ message: 'No access', type: 'error', title: '通知' })
      })
    })
  })
})
