// introspect.js
//
// POST /token/introspect
// Reference: http://connect2id.com/products/server/docs/api/token-introspection
import base64 from '../../modules/base64.js'

// Standardize the errors: either invalid (wrong, not supported, etc), 
// missing (required, but not provided), or forbidden (no permission)
const ErrorInvalidContentType = new Error('Invalid Content Type: Content-Type must be application/json')
const ErrorBasicAuthorizationMissing = new Error('Invalid Request: Basic authorization header is required')
const ErrorForbiddenAccess = new Error('Forbidden Access: Client does not have permission to access this service')

const introspect = async (ctx, next) => {
  // Business-rule-validation
  if (!ctx.is('application/json')) {
    ctx.throw('Bad Request', 400, {
      description: ErrorInvalidContentType.message
    })
  }
  const authorizationHeader = ctx.headers.authorization
  const [ authType, authToken ] = authorizationHeader.split(' ')
  if (authType !== 'Basic') {
    ctx.throw('Bad Request', 400, {
      description: ErrorBasicAuthorizationMissing.message
    })
  }
  const authTokenValidated = base64.decode(authToken)
  const [ clientId, clientSecret ] = authTokenValidated.split(':')
  if (!clientId || !clientSecret) {
    // throw error
    ctx.throw('Forbidden Access', 403, {
      description: ErrorForbiddenAccess.message
    })
  }
  // Fire external service
  // const client = await this.service.getClient({ clientId, clientSecret })
  // if (!client) {
  //   throw new Error('Forbidden Access: Client does not have permission to access this service') 
  // }
  try {
    const request = {
      token: ctx.request.body.token,
      token_type_hint: ctx.request.body.token_type_hint
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
    ctx.status = 500 // 400, 401, 402, 500
    ctx.body = {
      error: err.name, // TokenExpiredError 
      error_description: err.message
    }
  }
}

export default introspect
