import type { H3Event } from 'h3'

type ApiProxyOptions = {
  baseConfigKey: 'apiBase' | 'plcApiBase' | 'mesApiBase' | (string & {})
  path: string
  errorMessage: string
  forwardQuery?: boolean
}

export function createApiProxyHandler(options: ApiProxyOptions) {
  return defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const baseUrl = (config.public as Record<string, string>)[options.baseConfigKey]

    try {
      const query = options.forwardQuery ? getQuery(event) : undefined
      const response = await $fetch(`${baseUrl}/${options.path}`, {
        method: 'GET',
        ...(query ? { query } : {})
      })
      return response
    } catch {
      throw createError({
        statusCode: 500,
        statusMessage: options.errorMessage
      })
    }
  })
}
