import Ajv from 'ajv'
import Toolbox from '../common/toolbox.js'

const ajv = Ajv({
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
// Change the implementation slightly...
const parser = Toolbox.Parser(ajv)

export default {
  updateClientRequest: parser.request('http://localhost:3000/schemas/update-client-request.json#'),
  postClientRequest: parser.request('http://localhost:3000/schemas/post-client-request.json#'),
  postClientResponse: parser.request('http://localhost:3000/schemas/post-client-response.json#'),
  getClientRequest: parser.request('http://localhost:3000/schemas/get-client-request.json#'),
  getClientResponse: parser.request('http://localhost:3000/schemas/get-client-response.json#')
}
