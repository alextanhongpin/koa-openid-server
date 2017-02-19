// Parse the request and response body for the http REST transport
import Ajv from 'ajv'
// const ajv = Ajv({
//   allErrors: true,
//   schemas: [
//     require('./schema/post-device-request.json'),
//     require('./schema/post-device-response.json')
//   ]
// })
class Parser {
  constructor (props) {
    this.ajv = Ajv(props)
  }
  parse (schema) {
    return (params) => {
      const validator = this.ajv.getSchema(schema)
      const isValid = validator(params)
      if (!isValid) {
        const error = new Error('Invalid Schema')
        console.log(validator.errors)
        error.description = validator.errors[0].message
        throw error
      }
      return params
    }
  }
}

export default (options) => {
  return new Parser(options)
}
