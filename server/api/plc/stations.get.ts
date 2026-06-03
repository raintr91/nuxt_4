import { createApiProxyHandler } from '~/server/utils/createApiProxyHandler'

export default createApiProxyHandler({
  baseConfigKey: 'plcApiBase',
  path: 'stations',
  errorMessage: 'Failed to fetch PLC stations'
})
