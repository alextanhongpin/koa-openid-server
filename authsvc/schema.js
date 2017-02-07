
import Toolbox from '../common/toolbox.js'

const parser = Toolbox.Parser({
  allErrors: true,
  schemas: [
    require('./schema/login-request.json'),
    require('./schema/login-response.json'),
    require('./schema/register-request.json'),
    require('./schema/register-response.json')
  ]
})

export default {
  loginRequest: parser.parse('http://localhost:3000/schemas/login-request.json#'),
  loginResponse: parser.parse('http://localhost:3000/schemas/login-response.json#'),
  registerRequest: parser.parse('http://localhost:3000/schemas/register-request.json#'),
  registerResponse: parser.parse('http://localhost:3000/schemas/register-response.json#')
}
