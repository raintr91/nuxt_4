import { useCookie } from 'nuxt/app'
import type { MeResponse } from '~/types/api/auth'

export const AUTH_COOKIE_NAMES = {
  token: 'auth_token',
  refreshToken: 'refresh_token',
  user: 'auth_user'
} as const

const AUTH_COOKIE_OPTIONS = {
  sameSite: 'lax' as const,
  secure: false
}

export function useAuthCookies() {
  const token = useCookie<string | null>(AUTH_COOKIE_NAMES.token, AUTH_COOKIE_OPTIONS)
  const refreshToken = useCookie<string | null>(AUTH_COOKIE_NAMES.refreshToken, AUTH_COOKIE_OPTIONS)
  const user = useCookie<MeResponse | null>(AUTH_COOKIE_NAMES.user, AUTH_COOKIE_OPTIONS)

  return { token, refreshToken, user }
}
