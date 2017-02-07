import Toolbox from '../common/toolbox.js'

const parser = Toolbox.Parser({
  allErrors: true,
  schemas: [
    require('./schema/token-introspect-request.json'),
    require('./schema/token-introspect-response.json'),
    require('./schema/refresh-token-request.json'),
    require('./schema/refresh-token-response.json'),
    require('./schema/token-authorization-code-grant-request.json'),
    require('./schema/token-response.json'),
    require('./schema/authorize-request.json'),
    require('./schema/authorize-code-response.json')
  ]
})

export default {
  introspectRequest: parser.request('http://localhost:3000/schemas/token-introspect-request.json#'),
  introspectResponse: parser.response('http://localhost:3000/schemas/token-introspect-response.json#'),
  refreshTokenRequest: parser.request('http://localhost:3000/schemas/refresh-token-request.json#'),
  refreshTokenResponse: parser.response('http://localhost:3000/schemas/refresh-token-response.json#'),
  authorizeRequest: parser.request('http://localhost:3000/schemas/authorize-request.json#'),
  authorizeResponse: parser.response('http://localhost:3000/schemas/authorize-code-response.json#'),
  tokenRequest: parser.request('http://localhost:3000/schemas/token-authorization-code-grant-request.json#'),
  tokenResponse: parser.response('http://localhost:3000/schemas/token-response.json#')
}
