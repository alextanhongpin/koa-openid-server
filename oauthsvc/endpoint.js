// endpoint.js
import base64 from '../modules/base64.js'
import requestService from 'request'
import schema from './schema.js'
import OpenIdSDK from '../modules/openidsdk.js'

// The SDK is used on the client side to make requests to the openid endpoints
const openIdSDK = OpenIdSDK({
  clientId: 'Q_vcpNiuGw_LBxvg1MPzbbA6XGlT2abvLoPROLP61rA',
  clientSecret: 'FK07NzrgbGmkbwLkuF0Pu_Gzvk-kAavdMCWhLnvLXok',
  introspectEndpoint: 'http://localhost:3100/token/introspect'
})

// POST /token/introspect
// Reference: http://connect2id.com/products/server/docs/api/token-introspection

// Standardize the errors: either invalid (wrong, not supported, etc), 
// missing (required, but not provided), or forbidden (no permission)
const ErrorInvalidContentType = new Error('Invalid Content Type: Content-Type must be application/json')
const ErrorBasicAuthorizationMissing = new Error('Invalid Request: Basic authorization header is required')
const ErrorForbiddenAccess = new Error('Forbidden Access: Client does not have permission to access this service')

/*
const Endpoints = {
  AuthorizeEndpoint: '', 
}

const AuthorizeEndpoint = {
  const request = {
    response_type: ctx.query.response_type,
    scope: ctx.query.scope,
    client_id: ctx.query.client_id,
    state: ctx.query.state,
    redirect_uri: ctx.query.redirect_uri
  }
  try  {
    const response = await service(request)
  } catch (err) {
    
  }
}*/

const introspect = async (ctx, next) => {
  // Business-rule-validation
  if (!ctx.is('application/x-www-form-urlencoded')) {
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
  const request = schema.introspectRequest({
    token: ctx.request.body.token,
    token_type_hint: ctx.request.body.token_type_hint
  })
  const output = await ctx.service.introspect(request) 
  const response = schema.introspectResponse({
    active: output.active
  })

  ctx.status = 200
  ctx.body = response
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Pragma', 'no-cache')
}

const refresh = async(ctx, next) => {
  // Business-rule-validation
  if (!ctx.is('application/x-www-form-urlencoded')) {
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
}
// Login Endpoints
const getAuthorizeRequest = (req) => {
  return {
    response_type: req.response_type,
    scope: req.scope,
    client_id: req.client_id,
    state: req.state,
    redirect_uri: req.redirect_uri
  }
}

const getAuthorizeResponse = (res) => {
  return res
}

export default {
  // POST /client-introspect
  async postClientIntrospect (ctx, next) {
    // Fires a middleware sdk to introspect the token
    try {
      const response = await openIdSDK.introspect({
        token_type_hint: ctx.request.body.token_type_hint,
        token: ctx.request.body.token
      })
      // Success Response
      ctx.status = 200
      ctx.body = {
        active: true
      }
    } catch (err) {
      // Error response
      ctx.status = 200
      ctx.body = {
        active: false
      }
    }
  },
  introspect,
  // GET /authorize
  // Description: Renders the authorize view
  async getAuthorize (ctx, next) {
    const request = getAuthorizeRequest(ctx.query)
    const client = await this.service.getAuthorize(request)
    const response = getAuthorizeResponse(client)

    await ctx.render('consent', {
      title: 'Consent'
    })
  }


}
