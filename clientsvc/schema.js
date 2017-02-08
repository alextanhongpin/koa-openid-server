
import Toolbox from '../common/toolbox.js'

const ajv = Toolbox({
  allErrors: true,
  removeAdditional: true,
  // coerceTypes: true,
  schemas: [
    require('./schema/get-client-request.json'),
    require('./schema/get-client-response.json'),
    require('./schema/update-client-request.json'),
    require('./schema/post-client-request.json'),
    require('./schema/post-client-response.json')
    // require('./schema/introspect-response.json')
  ]
})

export default {
  updateClientRequest: parser.parse('http://localhost:3000/schemas/update-client-request.json#'),
  postClientRequest: parser.parse('http://localhost:3000/schemas/post-client-request.json#'),
  postClientResponse: parser.parse('http://localhost:3000/schemas/post-client-response.json#'),
  getClientRequest: parser.parse('http://localhost:3000/schemas/get-client-request.json#'),
  getClientResponse: parser.parse('http://localhost:3000/schemas/get-client-response.json#')
}
