import registry from '~/registries/page-lifecycle.registry.json'

/** Bước chính của page — không ghi sub-step (update spec, re-grill, …). */
export type PageLifecycleStage = 'design-spec' | 'prototype' | 'test' | 'wire'

export type PageLifecycleEntry = {
  stage: PageLifecycleStage
  spec: string
  title?: string
  updatedAt: string
  note?: string
}

export type PageLifecycleRegistry = {
  routes: Record<string, PageLifecycleEntry>
}

const STAGES_ORDER: PageLifecycleStage[] = ['design-spec', 'prototype', 'test', 'wire']

/** Stage hiện tại — luôn là bước cao nhất đã đạt; chỉ đổi khi promote thủ công hoặc portal-gen/lifecycle CLI. */
export function getPageLifecycleRegistry(): PageLifecycleRegistry {
  return registry as PageLifecycleRegistry
}

export function getPageLifecycleEntry(path: string): PageLifecycleEntry | undefined {
  const normalized = normalizeRoutePath(path)
  const routes = getPageLifecycleRegistry().routes

  if (routes[normalized]) {
    return routes[normalized]
  }

  const match = Object.keys(routes).find(
    (route) => normalized === route || normalized.startsWith(`${route}/`)
  )

  return match ? routes[match] : undefined
}

export function isAuthBypassStage(stage: PageLifecycleStage): boolean {
  return stage !== 'wire'
}

/** Route chưa wire API — bỏ qua auth.global; chỉ stage `wire` bật auth. */
export function getAuthBypassPaths(): string[] {
  const routes = getPageLifecycleRegistry().routes
  return Object.entries(routes)
    .filter(([, entry]) => isAuthBypassStage(entry.stage))
    .map(([routePath]) => routePath)
}

export function compareLifecycleStage(a: PageLifecycleStage, b: PageLifecycleStage): number {
  return STAGES_ORDER.indexOf(a) - STAGES_ORDER.indexOf(b)
}

function normalizeRoutePath(path: string): string {
  if (!path) return '/'
  const trimmed = path.split('?')[0]?.split('#')[0] ?? path
  if (trimmed === '/') return '/'
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}
