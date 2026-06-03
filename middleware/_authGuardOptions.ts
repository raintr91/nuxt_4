import type { RouteGuardOptions } from '~/composables/useRouteGuard'
import { AUTH_COOKIE_NAMES } from '~/utils/authCookies'

export const AUTH_GUARD_OPTIONS: RouteGuardOptions = {
  cookieName: AUTH_COOKIE_NAMES.token,
  mode: 'require',
  skipPaths: ['/auth', '/password/reset', '/404', '/forbidden'],
  redirectTo: '/auth/login',
  redirectQueryKey: 'redirect'
}
