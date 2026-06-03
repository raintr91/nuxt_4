import type { Role } from '~/types/api/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  const requiredRoles = (to.meta?.roles ?? []) as Role[]
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return

  if (!auth.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }

  if (!auth.user) {
    try {
      await auth.fetchMe()
    } catch (error) {
      console.error('[rbac] fetchMe failed, redirecting to login', error)
      auth.logout()
      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }
  }

  const role = auth.user?.role
  if (!role || !requiredRoles.includes(role)) {
    return navigateTo('/forbidden')
  }
})
