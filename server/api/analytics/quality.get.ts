import { createApiProxyHandler } from '~/server/utils/createApiProxyHandler'

export default createApiProxyHandler({
  baseConfigKey: 'apiBase',
  path: 'analytics/quality',
  errorMessage: 'Failed to fetch quality analytics',
  forwardQuery: true
})
