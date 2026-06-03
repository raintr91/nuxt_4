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

const MAX_FIELD_LENGTH = 2000

function truncate(value: unknown, max: number = MAX_FIELD_LENGTH): string {
  const str = typeof value === 'string' ? value : ''
  return str.length > max ? str.slice(0, max) : str
}

export default defineEventHandler(async (event) => {
  const contentLength = Number(getHeader(event, 'content-length') || 0)
  if (contentLength > 10_240) {
    throw createError({ statusCode: 413, statusMessage: 'Payload too large' })
  }

  const payload = (await readBody<ClientErrorLogPayload>(event).catch(() => ({}))) || {}

  const logsDir = resolve(process.cwd(), 'logs')
  await mkdir(logsDir, { recursive: true })

  const record = {
    portal: truncate(payload.portal) || 'portal',
    context: truncate(payload.context) || 'unknown',
    requestUrl: truncate(payload.requestUrl),
    status: typeof payload.status === 'number' ? payload.status : null,
    backendMessage: truncate(payload.backendMessage),
    technicalMessage: truncate(payload.technicalMessage),
    stack: truncate(payload.stack),
    occurredAt: truncate(payload.occurredAt) || new Date().toISOString()
  }

  await appendFile(resolve(logsDir, 'portal-errors.log'), `${JSON.stringify(record)}\n`, 'utf8')
  return { ok: true }
})
