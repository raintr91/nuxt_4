import { appendFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

type ClientErrorLogPayload = {
  portal?: string
  context?: string
  requestUrl?: string
  status?: number
  backendMessage?: string
  technicalMessage?: string
  stack?: string
  occurredAt?: string
}

export default defineEventHandler(async (event) => {
  let payload: ClientErrorLogPayload
  try {
    payload = (await readBody<ClientErrorLogPayload>(event)) || {}
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const logsDir = resolve(process.cwd(), 'logs')
  await mkdir(logsDir, { recursive: true })

  const record = {
    portal: payload.portal || 'portal',
    context: payload.context || 'unknown',
    requestUrl: payload.requestUrl || '',
    status: typeof payload.status === 'number' ? payload.status : null,
    backendMessage: payload.backendMessage || '',
    technicalMessage: payload.technicalMessage || '',
    stack: payload.stack || '',
    occurredAt: payload.occurredAt || new Date().toISOString()
  }

  try {
    await appendFile(resolve(logsDir, 'portal-errors.log'), `${JSON.stringify(record)}\n`, 'utf8')
  } catch (err) {
    console.error('[client-error] failed to write log', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to persist error log' })
  }
  return { ok: true }
})
