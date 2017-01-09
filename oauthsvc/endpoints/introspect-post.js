// introspect.js
//
// POST /token/introspect
// Reference: http://connect2id.com/products/server/docs/api/token-introspection
import base64 from '../../modules/base64.js'


// @res is the response from the service
// HTTP/1.1 200 OK
// Content-Type: application/json
// Cache-Control: no-store
// Pragma: no-cache

// HTTP/1.1 200 OK
// Content-Type: application/json;charset=UTF-8
// {
//   "active"     : true,
//   "scope"      : "https://example.com/accounts https://example.com/groups",
//   "client_id"  : "izad7cqy34bg4",
// username
//   "token_type" : "Bearer",
//   "exp"        : 1448367412,
// iat
// nbf
//   "sub"        : "izad7cqy34bg4",
// aud
//   "iss"        : "https://c2id.com"
// jti
// dat
// }
function response (res) {
  return {
    active: res.active
  }
}


const introspect = async (ctx, next) => {
  if (!ctx.is('application/json')) {
    ctx.throw('Invalid Content Type: Content-Type must be application/json', 400)
  }
  try {
    const auth = ctx.headers.authorization
    const [ authType, authToken ] = auth.split(' ')
    if (authType !== 'Basic') {
      // throw error
      throw new Error('Invalid Request: Basic authorization header is required')
    }
    const authTokenValidated = base64.decode(authToken)
    const [ clientId, clientSecret ] = authTokenValidated.split(':')
    if (!clientId || !clientSecret) {
      // throw error
      throw new Error('Forbidden Access: Client does not have permission to access this service')
    }
    // Fire external service
    // const client = await this.service.getClient({ clientId, clientSecret })
    // if (!client) {
    //   throw new Error('Forbidden Access: Client does not have permission to access this service') 
    // }

    const request = {
      token_type_hint: ctx.request.body.token_type_hint,
      token: ctx.request.body.token
    }

    const output = await ctx.service.postIntrospect(request)

    const response = {
      active: output.active
      // scope: "https://example.com/accounts https://example.com/groups",
      // client_id  : "izad7cqy34bg4",
      // username
      // token_type : "Bearer",
      // exp        : 1448367412,
      // iat
      // nbf
      // sub        : "izad7cqy34bg4",
      // aud
      // iss       : "https://c2id.com"
      // jti
      // dat
    }
    
    // Return as json
    ctx.status = 200
    ctx.body = response
    ctx.set('Cache-Control', 'no-cache')
    ctx.set('Pragma', 'no-cache')
    // no store
    // no cache
  } catch (err) {
    // ctx.status = 500
    // this.error()
    ctx.status = 400 // 400, 401, 402, 500
    ctx.body = {
      error: err.name, // TokenExpiredError 
      error_description: err.message
    }
  }
}

export default introspect
