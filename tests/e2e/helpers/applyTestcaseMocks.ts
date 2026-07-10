import type { Page } from '@playwright/test'

import { mockAuthenticatedSession } from './session'

export type TestcaseMockConfig = {
  method: string
  path: string
  response: string
}

const SESSION_HANDLERS: Record<string, (page: Page) => Promise<void>> = {
  mockAuthenticatedSession
}

/** Register feature fixtures here as pilots land (sample-items, knowledge-hub, …). */
const FIXTURE_HANDLERS: Record<string, () => unknown> = {}

/** testcase YAML may use `/api/...`; Next `apiFetch` calls `NEXT_PUBLIC_API_URL/api/...`. */
export function expandApiPathVariants(path: string): string[] {
  if (path.startsWith('/api')) {
    const bare = path.replace(/^\/api/, '') || path
    return [path, bare]
  }
  return [path, `/api${path}`]
}

export function urlMatchesApiPath(url: string, path: string): boolean {
  return expandApiPathVariants(path).some((segment) => url.includes(segment))
}

export async function applyTestcaseSession(page: Page, sessionName: string) {
  const handler = SESSION_HANDLERS[sessionName]
  if (!handler) {
    throw new Error(`Unknown testcase session "${sessionName}". Register in tests/e2e/helpers/applyTestcaseMocks.ts`)
  }
  await handler(page)
}

export async function applyTestcaseMocks(page: Page, mocks: TestcaseMockConfig[] = []) {
  if (!mocks.length) return

  await page.route('**/*', async (route) => {
    const request = route.request()
    if (request.resourceType() === 'document') {
      await route.fallback()
      return
    }

    const mock = mocks.find(
      (entry) =>
        request.method() === entry.method.toUpperCase() &&
        urlMatchesApiPath(request.url(), entry.path)
    )

    if (!mock) {
      await route.fallback()
      return
    }

    const fixture = FIXTURE_HANDLERS[mock.response]
    if (!fixture) {
      throw new Error(`Unknown testcase fixture "${mock.response}". Register in tests/e2e/helpers/applyTestcaseMocks.ts`)
    }

    const payload = fixture()
    const isBinary = Buffer.isBuffer(payload)

    await route.fulfill({
      status: 200,
      contentType: isBinary
        ? 'application/octet-stream'
        : 'application/json',
      body: isBinary ? payload : JSON.stringify(payload)
    })
  })
}
