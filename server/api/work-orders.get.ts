import { createApiProxyHandler } from '~/server/utils/createApiProxyHandler'

export default createApiProxyHandler({
  baseConfigKey: 'mesApiBase',
  path: 'work-orders',
  errorMessage: 'Failed to fetch work orders',
  forwardQuery: true
})
