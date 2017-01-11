// Parse the request and response body for the http REST transport
const parser = (ajv) => {
  const request = (schema) => {
    return (req) => {
      const validator = ajv.getSchema(schema)
      const isValid = validator(req)
      if (!isValid) {
        const error = new Error('Invalid Request')
        error.description = validator.errors[0].message
        throw error
      }
      return req
    }
  }
  
  const response = (schema) => {
    return (res) => {
      const validator = ajv.getSchema(schema)
      const isValid = validator(res)
      if (!isValid) {
        const error = new Error('Invalid Response')
        error.description = validator.errors[0].message
        throw error
      }
      return res
    }
  }
  return  {
    request,
    response
  }
}

export default { parser }
