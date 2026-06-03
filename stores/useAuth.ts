import { defineStore } from 'pinia'
import { computed } from 'vue'

import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  MeResponse,
  RegisterRequest,
  ResetPasswordRequest,
  TokenResponse
} from '~/types/api/auth'
import type { ApiResponse } from '~/types/api/common'
import { assertApiSuccess } from '~/types/api/common'
import { useAuthCookies } from '~/utils/authCookies'

export const useAuth = defineStore('useAuth', () => {
  const { $apiFetch } = useNuxtApp()

  const { token: tokenCookie, refreshToken: refreshTokenCookie, user: userCookie } = useAuthCookies()

  const token = computed(() => tokenCookie.value)
  const isAuthenticated = computed(() => Boolean(tokenCookie.value))
  const user = computed(() => userCookie.value)

  const setToken = (value: string | null) => { tokenCookie.value = value }
  const setRefreshToken = (value: string | null) => { refreshTokenCookie.value = value }
  const setUser = (value: MeResponse | null) => { userCookie.value = value }

  const logout = () => {
    setToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  const fetchMe = async () => {
    if (!tokenCookie.value) { setUser(null); return null }
    try {
      const res = await $apiFetch<ApiResponse<MeResponse>>('/api/auth/me', { method: 'GET' })
      assertApiSuccess(res)
      setUser(res.data)
      return res.data
    } catch {
      return userCookie.value
    }
  }

  const setTokensFromResponse = (data: TokenResponse) => {
    setToken(data.accessToken ?? data.token ?? null)
    setRefreshToken(data.refreshToken ?? null)
  }

  const login = async (payload: LoginRequest) => {
    // Ensure old/expired token is not reused on login request.
    logout()

    const res = await $apiFetch<ApiResponse<{ token?: string | null; user?: MeResponse } & TokenResponse>>('/api/auth/login', {
      method: 'POST',
      body: payload
    })
    assertApiSuccess(res)

    const issuedToken = res.data.accessToken ?? res.data.token ?? null
    if (!issuedToken) {
      throw new Error('Login succeeded but token was not returned.')
    }

    setToken(issuedToken)
    setRefreshToken(res.data.refreshToken ?? null)

    if (res.data.user) {
      setUser(res.data.user)
    } else {
      await fetchMe()
    }
    return res.data
  }

  const register = async (payload: RegisterRequest) => {
    const res = await $apiFetch<ApiResponse<TokenResponse>>('/api/auth/register', {
      method: 'POST',
      body: { name: payload.name ?? 'User', email: payload.email, password: payload.password }
    })
    assertApiSuccess(res)
    setTokensFromResponse(res.data)
    await fetchMe()
    return res.data
  }

  const forgotPassword = async (payload: ForgotPasswordRequest) => {
    const res = await $apiFetch<ApiResponse<null>>('/api/auth/forgot-pass', {
      method: 'POST',
      body: payload
    })
    assertApiSuccess(res)
    return res
  }

  const resetPassword = async (payload: ResetPasswordRequest) => {
    const res = await $apiFetch<ApiResponse<null>>('/api/auth/reset-pass', {
      method: 'POST',
      body: payload
    })
    assertApiSuccess(res)
    return res
  }

  const changePassword = async (_payload: ChangePasswordRequest) => {
    throw new Error('changePassword not implemented for this portal')
  }

  const apiLogout = async () => {
    try {
      await $apiFetch('/api/auth/logout', { method: 'POST' })
    } finally {
      logout()
    }
  }

  return {
    token,
    isAuthenticated,
    user,
    setToken,
    setRefreshToken,
    setUser,
    logout,
    login,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    apiLogout,
    fetchMe
  }
})
