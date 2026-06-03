import { createRouteGuardHandler } from '~/composables/useRouteGuard'
import { AUTH_COOKIE_NAMES } from '~/utils/authCookies'

/**
 * Guest-only: redirect to redirectTo (or query.redirect) when user is already logged in.
 * Use on auth pages (login, register) so logged-in users are sent to app/dashboard.
 */
export default defineNuxtRouteMiddleware(
  createRouteGuardHandler({
    cookieName: AUTH_COOKIE_NAMES.token,
    mode: 'guest',
    redirectTo: '/',
    redirectQueryKey: 'redirect'
  })
)
