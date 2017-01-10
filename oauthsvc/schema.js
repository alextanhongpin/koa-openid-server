import Ajv from 'ajv'
const ajv = Ajv({
  allErrors: true,
  schemas: [
    require('./schema/introspect-request.json'),
    require('./schema/introspect-response.json'),
    require('./schema/refresh-token-request.json'),
    require('./schema/refresh-token-response.json')
  ]
})
// Change the implementation slightly...
const introspectRequest = (req) {
  const validator = ajv.getSchema('http://localhost:3000/schemas/introspect-request.json#')
  const isValid = validator(req)
  if (!isValid) {
    const error = new Error('Invalid Request')
    error.description = validator.introspectRequest.errors[0].message
    throw error
  }
  return req
}
const introspectResponse = (res) {
  const validator = ajv.getSchema('http://localhost:3000/schemas/introspect-response.json#')
  const isValid = validator(res)
  if (!isValid) {
    const error = new Error('Invalid Response')
    error.description = validator.introspectResponse.errors[0].message
    throw error
  }
  return res
}

export default {
  introspectRequest,
  introspectResponse,
  refreshTokenRequest: ajv.getSchema('http://localhost:3000/schemas/refresh-token-request.json#'),
  refreshTokenResponse: ajv.getSchema('http://localhost:3000/schemas/refresh-token-response.json#'),
}
