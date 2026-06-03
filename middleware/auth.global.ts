import { createRouteGuardHandler } from '~/composables/useRouteGuard'
import { AUTH_GUARD_OPTIONS } from '~/middleware/_authGuardOptions'

export default defineNuxtRouteMiddleware(
  createRouteGuardHandler(AUTH_GUARD_OPTIONS)
)
