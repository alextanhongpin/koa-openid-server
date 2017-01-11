// endpoint.js
import base64 from '../modules/base64.js'
import requestService from 'request'
import schema from './schema.js'
import qs from 'querystring'
import OpenIdSDK from '../modules/openidsdk.js'

// The SDK is used on the client side to make requests to the openid endpoints
const openIdSDK = OpenIdSDK({
  clientId: 'Q_vcpNiuGw_LBxvg1MPzbbA6XGlT2abvLoPROLP61rA',
  clientSecret: 'FK07NzrgbGmkbwLkuF0Pu_Gzvk-kAavdMCWhLnvLXok',
  introspectEndpoint: 'http://localhost:3100/token/introspect',
  refreshTokenEndpoint: 'http://localhost:3100/token/refresh',
})

// POST /token/introspect
// Reference: http://connect2id.com/products/server/docs/api/token-introspection

// Standardize the errors: either invalid (wrong, not supported, etc), 
// missing (required, but not provided), or forbidden (no permission)
const ErrorInvalidContentType = new Error('Invalid Content Type: Content-Type must be application/json')
const ErrorBasicAuthorizationMissing = new Error('Invalid Request: Basic authorization header is required')
const ErrorForbiddenAccess = new Error('Forbidden Access: Client does not have permission to access this service')

const getAuthorize = async (ctx, next) => {
  const request = schema.authorizeRequest(ctx.query)
  const client = await ctx.service.getAuthorize(request)

  if (!client) {
    // Error getting client
  } else {
    // client name,
    // client logo
    // client scopes
    // client redirect uri matches
    // Render the consent screen
    await ctx.render('consent', {
      title: 'Consent',
      client: client
    })
  }
  // validate the request and also client first
}

const postAuthorize = async (ctx, next) => {
  const request = schema.authorizeRequest(ctx.query)
  const output = await ctx.service.postAuthorize(request)
  const response = schema.authorizeResponse({
    code: output.code,
    state: output.state
  })
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Pragma', 'no-cache')
  // redirect to the callback url
  ctx.redirect(`${request.redirect_uri}?qs.stringify(response)`)
}

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
  // Fire external service
  // const client = await this.service.getClient({ clientId, clientSecret })
  // if (!client) {
  //   throw new Error('Forbidden Access: Client does not have permission to access this service') 
  // }
  const request = schema.refreshTokenRequest({
    grant_type: ctx.request.body.grant_type,
    refresh_token: ctx.request.body.refresh_token,
    scope: ctx.request.body.scope,
    redirect_uri: ctx.request.body.redirect_uri
  })
  const output = await ctx.service.refresh(request) 
  console.log('refreshTokenResponse', output)
  const response = schema.refreshTokenResponse({
    access_token: output.access_token,
    refresh_token: output.refresh_token,
    expires_in: output.expires_in,
    token_type: output.token_type
  })

  ctx.status = 200
  ctx.body = response
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Pragma', 'no-cache')
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
  async postClientRefreshToken (ctx, next) {
    try {
      const response = await openIdSDK.refresh({
        refresh_token: ctx.request.body.refreshToken,
        grant_type: 'refresh_token',
        scope: [],
        redirect_uri: 'something'
      })
      ctx.status = 200
      ctx.body = response
    } catch (err) {
      throw err
    }
  },
  async getClientAuthorize (ctx, next) {
    const response = await openIdSDK.authorize()
    res.redirect(response.authorize_uri)
  },
  async getClientAuthorizeCallback (ctx, next) {
    try {
      const request = {
        code: ctx.query.code
      }
      const response = await openIdSDK.authorizeCallback(request)

      ctx.status = 200
      ctx.body = response
    } catch (err) {
      // handle error
      console.log(err)
    }
  },
  introspect,
  refresh,

}
