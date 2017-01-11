import Ajv from 'ajv'
import Toolbox from '../common/toolbox.js'

const ajv = Ajv({
  allErrors: true,
  schemas: [
    require('./schema/introspect-request.json'),
    require('./schema/introspect-response.json'),
    require('./schema/refresh-token-request.json'),
    require('./schema/refresh-token-response.json'),
    require('./schema/token-request.json'),
    require('./schema/token-response.json'),
    require('./schema/authorize-request.json'),
    require('./schema/authorize-response.json')
  ]
})
// Change the implementation slightly...
const parser = Toolbox.Parser(ajv)

export default {
  introspectRequest: parser.request('http://localhost:3000/schemas/introspect-request.json#'),
  introspectResponse: parser.response('http://localhost:3000/schemas/introspect-response.json#'),
  refreshTokenRequest: parser.request('http://localhost:3000/schemas/refresh-token-request.json#'),
  refreshTokenResponse: parser.response('http://localhost:3000/schemas/refresh-token-response.json#'),
  authorizeRequest: parser.request('http://localhost:3000/schemas/authorize-request.json#'),
  authorizeResponse: parser.response('http://localhost:3000/schemas/authorize-response.json#'),
  tokenRequest: parser.request('http://localhost:3000/schemas/token-request.json#'),
  tokenResponse: parser.response('http://localhost:3000/schemas/token-response.json#')
}
