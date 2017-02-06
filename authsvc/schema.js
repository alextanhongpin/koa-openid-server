import Ajv from 'ajv'
import Toolbox from '../common/toolbox.js'

const ajv = Ajv({
  allErrors: true,
  schemas: [
    require('./schema/login-request.json'),
    require('./schema/login-response.json'),
    require('./schema/register-request.json'),
    require('./schema/register-response.json')
  ]
})

const parser = Toolbox.Parser(ajv)

export default {
  loginRequest: parser.request('http://localhost:3000/schemas/login-request.json#'),
  loginResponse: parser.response('http://localhost:3000/schemas/login-response.json#'),
  registerRequest: parser.request('http://localhost:3000/schemas/register-request.json#'),
  registerResponse: parser.response('http://localhost:3000/schemas/register-response.json#')
}
