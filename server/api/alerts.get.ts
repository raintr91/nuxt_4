import { createApiProxyHandler } from '~/server/utils/createApiProxyHandler'

export default createApiProxyHandler({
  baseConfigKey: 'apiBase',
  path: 'alerts',
  errorMessage: 'Failed to fetch active alerts'
})
