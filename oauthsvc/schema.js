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

const parseResponse = (schema) => {
  return (res) => {
    const validator = ajv.getSchema('http://localhost:3000/schemas/introspect-response.json#')
    const isValid = validator(res)
    if (!isValid) {
      const error = new Error('Invalid Response')
      error.description = validator.errors[0].message
      throw error
    }
    return res
  }
}



const parseRequest = (schema) => {
  return (req) => {
    const validator = ajv.getSchema(schema)
    const isValid = validator(req)
    if (!isValid) {
      const error = new Error('Invalid Request')
      error.description = validator.errors[0].message
      throw error
    }
    return req
  }
}

export default {
  introspectRequest: parseRequest('http://localhost:3000/schemas/introspect-request.json#'),
  introspectResponse: parseResponse('http://localhost:3000/schemas/introspect-response.json#'),
  refreshTokenRequest: parseRequest('http://localhost:3000/schemas/refresh-token-request.json#'),
  refreshTokenResponse: parseResponse('http://localhost:3000/schemas/refresh-token-response.json#'),
}
