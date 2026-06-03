import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockNavigateTo = vi.fn()
const mockAuth = {
  isAuthenticated: false,
  user: null as { role?: string } | null,
  fetchMe: vi.fn(),
  logout: vi.fn()
}

vi.stubGlobal('navigateTo', mockNavigateTo)
vi.stubGlobal('useAuth', () => mockAuth)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.stubGlobal('defineNuxtRouteMiddleware', (fn: (...args: any[]) => any) => fn)

function route(path: string, meta: Record<string, unknown> = {}) {
  return { path, fullPath: path, query: {}, meta } as unknown as Parameters<typeof import('~/middleware/rbac').default>[0]
}

describe('middleware/rbac', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let handler: (...args: any[]) => any

  beforeEach(async () => {
    mockNavigateTo.mockClear()
    mockAuth.isAuthenticated = false
    mockAuth.user = null
    mockAuth.fetchMe.mockReset()
    mockAuth.logout.mockReset()

    vi.resetModules()
    const mod = await import('~/middleware/rbac')
    handler = mod.default
  })

  it('does nothing when no roles required', async () => {
    mockAuth.isAuthenticated = true
    await handler(route('/page', {}))
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('does nothing when roles array is empty', async () => {
    mockAuth.isAuthenticated = true
    await handler(route('/page', { roles: [] }))
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects to login when not authenticated', async () => {
    mockAuth.isAuthenticated = false
    await handler(route('/admin', { roles: ['OWNER'] }))
    expect(mockNavigateTo).toHaveBeenCalledWith({
      path: '/auth/login',
      query: { redirect: '/admin' }
    })
  })

  it('fetches user when authenticated but user is null', async () => {
    mockAuth.isAuthenticated = true
    mockAuth.user = null
    mockAuth.fetchMe.mockResolvedValue({ role: 'OWNER' })
    await handler(route('/admin', { roles: ['OWNER'] }))
    expect(mockAuth.fetchMe).toHaveBeenCalled()
  })

  it('redirects to login and logs out if fetchMe throws', async () => {
    mockAuth.isAuthenticated = true
    mockAuth.user = null
    mockAuth.fetchMe.mockRejectedValue(new Error('fail'))
    await handler(route('/admin', { roles: ['OWNER'] }))
    expect(mockAuth.logout).toHaveBeenCalled()
    expect(mockNavigateTo).toHaveBeenCalledWith({
      path: '/auth/login',
      query: { redirect: '/admin' }
    })
  })

  it('redirects to /forbidden when user role not in required roles', async () => {
    mockAuth.isAuthenticated = true
    mockAuth.user = { role: 'USER' }
    await handler(route('/admin', { roles: ['OWNER'] }))
    expect(mockNavigateTo).toHaveBeenCalledWith('/forbidden')
  })

  it('allows access when user role matches', async () => {
    mockAuth.isAuthenticated = true
    mockAuth.user = { role: 'OWNER' }
    await handler(route('/admin', { roles: ['OWNER', 'PLANNER'] }))
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects to /forbidden when user has no role', async () => {
    mockAuth.isAuthenticated = true
    mockAuth.user = {}
    await handler(route('/admin', { roles: ['OWNER'] }))
    expect(mockNavigateTo).toHaveBeenCalledWith('/forbidden')
  })
})
