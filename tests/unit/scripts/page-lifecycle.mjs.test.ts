import { describe, expect, it } from 'vitest'

import {
  resolveLifecycleStage,
  routePathFromPageFile
} from '../../../codegen/runners/lib/page-lifecycle.mjs'

describe('page-lifecycle.mjs helpers', () => {
  it('maps Next page file to route path', () => {
    expect(routePathFromPageFile('src/app/(dashboard)/hotels/page.tsx')).toBe('/hotels')
    expect(routePathFromPageFile('src/app/(dashboard)/admin/hotels/page.tsx')).toBe('/admin/hotels')
    expect(routePathFromPageFile('src/app/(dashboard)/page.tsx')).toBe('/')
  })

  it('does not downgrade stage by default', () => {
    expect(resolveLifecycleStage('prototype', 'wire')).toBe('wire')
  })

  it('allows downgrade when requested', () => {
    expect(resolveLifecycleStage('design-spec', 'prototype', { allowDowngrade: true })).toBe('design-spec')
  })
})
