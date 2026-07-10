import type { BrowserContext, Page } from '@playwright/test'

export type ApiEnvelope<T> = {
  success: true
  code: number
  message: string
  data: T
  meta: null
  trace_id: null
}

const defaultUser = {
  id: 1,
  name: 'User',
  full_name: 'Portal User',
  email: 'user@example.com',
  role: 'USER',
  active: true,
  status: 1
}

export function success<T>(data: T, message = 'OK'): ApiEnvelope<T> {
  return {
    success: true,
    code: 200,
    message,
    data,
    meta: null,
    trace_id: null
  }
}

export function getBaseUrl() {
  const fromEnv = process.env.PLAYWRIGHT_BASE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  const port = process.env.E2E_PORT?.trim() || '3005'
  return `http://127.0.0.1:${port}`
}

export async function clearSession(context: BrowserContext) {
  await context.clearCookies()
}

export async function mockAuthenticatedSession(page: Page) {
  await installAuthSession(page, defaultUser)
}

async function installAuthSession(page: Page, user: typeof defaultUser) {
  const baseUrl = getBaseUrl()

  await page.context().addCookies([
    { name: 'auth_token', value: 'fake-token', url: baseUrl },
    { name: 'auth_user', value: encodeURIComponent(JSON.stringify(user)), url: baseUrl }
  ])

  await page.route('**/api/auth/me*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(success(user))
    })
  })

  await page.route('**/api/internal/client-error', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true })
    })
  })
}

export async function mockAuthenticatedApi(page: Page) {
  await page.route('**/api/**', async (route) => {
    if (route.request().url().includes('/api/auth/me')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(success(defaultUser))
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(success([]))
    })
  })
}
