export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    const response = await $fetch(`${config.public.apiBase}/analytics/quality`, {
      method: 'GET',
      query: {
        time_range: query.time_range || '7d'
      }
    })

    return response
  } catch (error: unknown) {
    const status = (error as any)?.response?.status ?? (error as any)?.statusCode ?? 500
    console.error('[analytics/quality.get] upstream error', error)
    throw createError({
      statusCode: status >= 400 && status < 600 ? status : 500,
      statusMessage: 'Failed to fetch quality analytics'
    })
  }
})