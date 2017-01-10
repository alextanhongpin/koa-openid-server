import Ajv from 'ajv'
const ajv = Ajv({
  allErrors: true,
  schemas: [
    require('./schema/login-request.json'),
    require('./schema/login-response.json'),
    require('./schema/register-request.json'),
    require('./schema/register-response.json')
  ]
})

export default {
  loginRequest: ajv.getSchema('http://localhost:3000/schemas/login-request.json#'),
  loginResponse: ajv.getSchema('http://localhost:3000/schemas/login-response.json#'),
  registerRequest: ajv.getSchema('http://localhost:3000/schemas/register-request.json#'),
  registerResponse: ajv.getSchema('http://localhost:3000/schemas/register-response.json#'),
}
