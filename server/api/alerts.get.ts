export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const response = await $fetch(`${config.public.apiBase}/alerts`, {
      method: 'GET'
    })

    return response
  } catch (error: unknown) {
    const status = (error as any)?.response?.status ?? (error as any)?.statusCode ?? 500
    console.error('[alerts.get] upstream error', error)
    throw createError({
      statusCode: status >= 400 && status < 600 ? status : 500,
      statusMessage: 'Failed to fetch active alerts'
    })
  }
})