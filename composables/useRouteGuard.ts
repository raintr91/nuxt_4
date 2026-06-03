import type { RouteLocationNormalized } from 'vue-router'
import { useCookie } from 'nuxt/app'

export type RouteGuardOptions = {
  /** Cookie name to read (e.g. auth_token) */
  cookieName: string
  /** require = redirect when cookie missing; guest = redirect when cookie present */
  mode: 'require' | 'guest'
  /** Paths to skip (e.g. /auth). For require: allow access without token; for guest: still run redirect when token present */
  skipPaths?: string[]
  /** Where to redirect when guard triggers */
  redirectTo: string
  /** Query key for return URL (e.g. redirect=/dashboard) */
  redirectQueryKey?: string
}

function isSafeRedirect(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//')
}

/**
 * Abstract route guard factory. Returns a handler (to, from) for use with defineNuxtRouteMiddleware.
 *
 * - mode 'require': allow only when cookie is set; else redirect to redirectTo with ?redirect=to.fullPath
 * - mode 'guest': allow only when cookie is not set; else redirect to redirectTo or query[redirectQueryKey]
 *
 * skipPaths: for 'require', paths that do not require the cookie; for 'guest', paths that are still checked (token present => redirect).
 */
export function createRouteGuardHandler(options: RouteGuardOptions) {
  const {
    cookieName,
    mode,
    redirectTo,
    redirectQueryKey = 'redirect'
  } = options
  const skipPaths = options.skipPaths ?? []

  return (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const token = useCookie<string | null>(cookieName)
    const hasToken = Boolean(token.value)

    if (skipPaths.some((p) => to.path.startsWith(p))) {
      // require: path is public, allow without token
      if (mode === 'require') return
      // guest: path is always allowed (e.g. public auth page), skip redirect
      return
    }

    if (mode === 'require') {
      if (!hasToken) {
        const url = to.fullPath
          ? `${redirectTo}?${redirectQueryKey}=${encodeURIComponent(to.fullPath)}`
          : redirectTo
        return navigateTo(url, { replace: true })
      }
    } else {
      if (hasToken) {
        const raw = (to.query[redirectQueryKey] as string) || redirectTo
        const dest = isSafeRedirect(raw) ? raw : redirectTo
        return navigateTo(dest, { replace: true })
      }
    }
  }
}
