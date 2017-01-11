import Ajv from 'ajv'
import Parser from '../common/toolbox.js'

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
const parser = Parser(ajv)

export default {
  introspectRequest: parser.request('http://localhost:3000/schemas/introspect-request.json#'),
  introspectResponse: parser.response('http://localhost:3000/schemas/introspect-response.json#'),
  refreshTokenRequest: parser.request('http://localhost:3000/schemas/refresh-token-request.json#'),
  refreshTokenResponse: parser.response('http://localhost:3000/schemas/refresh-token-response.json#'),
}
