export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    const response = await $fetch(`${config.public.mesApiBase}/work-orders`, {
      method: 'GET',
      query
    })

    return response
  } catch (error: unknown) {
    const status = (error as any)?.response?.status ?? (error as any)?.statusCode ?? 500
    console.error('[work-orders.get] upstream error', error)
    throw createError({
      statusCode: status >= 400 && status < 600 ? status : 500,
      statusMessage: 'Failed to fetch work orders'
    })
  }
})