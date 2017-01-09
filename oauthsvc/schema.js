import Ajv from 'ajv'
const ajv = Ajv({
  allErrors: true,
  schemas: [
    require('./schema/introspect-request.json'),
    require('./schema/introspect-response.json')
  ]
})

export default {
  introspectRequest: ajv.getSchema('http://localhost:3000/schemas/introspect-request.json#'),
  introspectResponse: ajv.getSchema('http://localhost:3000/schemas/introspect-response.json#'),
  refreshTokenRequest: ajv.getSchema('http://localhost:3000/schemas/refresh-token-request.json#'),
  refreshTokenResponse: ajv.getSchema('http://localhost:3000/schemas/refresh-token-response.json#'),
}

// var validate = ajv.getSchema("http://mynet.com/schemas/navigation.json#");
// var valid = validate(navigationData);
// if (!valid) console.log(validate.errors);