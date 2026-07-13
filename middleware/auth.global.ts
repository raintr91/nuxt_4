import { createRouteGuardHandler } from '~/composables/useRouteGuard'
import { getAuthBypassPaths } from '~/utils/page-lifecycle'

export default defineNuxtRouteMiddleware(
  createRouteGuardHandler({
    cookieName: 'auth_token',
    mode: 'require',
    // Public routes + lifecycle routes chưa wire (see registries/page-lifecycle.registry.json)
    skipPaths: ['/auth', '/password/reset', '/404', '/forbidden', ...getAuthBypassPaths()],
    redirectTo: '/auth/login',
    redirectQueryKey: 'redirect'
  })
)
