// endpoint.js
import base64 from '../modules/base64.js'
import requestService from 'request'
import schema from './schema.js'
import qs from 'querystring'
import OpenIdSDK from '../modules/openidsdk.js'
import jwt from '../modules/jwt'
import redis from '../common/redis.js'

// The SDK is used on the client side to make requests to the openid endpoints
const openIdSDK = OpenIdSDK({
  authorizeEndpoint: 'http://localhost:3100/authorize',
  redirectURI: 'http://localhost:3100/client-authorize/callback',
  clientId: 'jHS3sWTkO4u3sIAMWcj_0smNhndmmKrRZHfmt00D0Mg',
  clientSecret: 'jHS3sWTkO4u3sIAMWcj_0smNhndmmKrRZHfmt00D0Mg-kAavdMCWhLnvLXok',
  scope: ['openid', 'email'],
  introspectEndpoint: 'http://localhost:3100/token/introspect',
  refreshTokenEndpoint: 'http://localhost:3100/token/refresh',
  tokenEndpoint: 'http://localhost:3100/token'
})

// POST /token/introspect
// Reference: http://connect2id.com/products/server/docs/api/token-introspection

// Standardize the errors: either invalid (wrong, not supported, etc),
// missing (required, but not provided), or forbidden (no permission)
const ErrorInvalidContentType = new Error('Invalid Content Type: Content-Type must be application/json')
const ErrorBasicAuthorizationMissing = new Error('Invalid Request: Basic authorization header is required')
const ErrorForbiddenAccess = new Error('Forbidden Access: Client does not have permission to access this service')

const getAuthorize = async (ctx, next) => {
  try {
    const request = schema.authorizeRequest(ctx.query)
    const client = await ctx.service.getAuthorize(request)

    await ctx.render('consent', {
      title: 'Consent',
      client: client,
      // NOTE: can be masked with additional jwt for security
      request: JSON.stringify(request)
    })
  } catch (err) {
    const error = qs.stringify({
      error: err.message,
      error_description: err.description
    })
    // NOTE: Instead of returning a json error,
    // return it as the query in the url
    return ctx.redirect(`${err.redirect_uri}?${error}`)
  }
}

const checkUser = async (ctx, next) => {
  const authorizationHeader = ctx.headers.authorization
  const [ authType, authToken ] = authorizationHeader.split(' ')
  if (authType !== 'Bearer') {
    const error = qs.stringify({
      error: 'Bad Request',
      description: ErrorBasicAuthorizationMissing.message
    })
    ctx.status = 400
    ctx.body = {
      redirect_uri: `${ctx.state.request.redirect_uri}?${error}`
    }
  }

  try {
    const token = await jwt.verify(authToken)
    ctx.state.user_id = token.user_id
    await next()
  } catch (err) {
    const error = qs.stringify({
      error: err.name,
      error_description: err.message
    })

    ctx.set('Cache-Control', 'no-cache')
    ctx.set('Pragma', 'no-cache')
    ctx.status = 400
    ctx.body = {
      redirect_uri: `${ctx.state.request.redirect_uri}?${error}`
    }
  }
}

const cacheAuthorizationCode = async (ctx, next) => {
  const FIVE_MINUTES = 300
  const value = `authcode:user:${ctx.state.response.code}`
  redis.set(value, ctx.state.user_id)
  redis.expire(value, FIVE_MINUTES)
}

// POST /authorize
// Description: Coming from the consent screen,
// should return a valid code once the user has been
// validated
const postAuthorize = async (ctx, next) => {
  const request = schema.authorizeRequest(ctx.request.body)
  const output = await ctx.service.postAuthorize(request)
  const response = schema.authorizeResponse({
    code: output.code,
    state: output.state
  })
  ctx.state.request = request
  ctx.state.response = response

  await next()

  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Pragma', 'no-cache')
  ctx.status = 200
  ctx.body = {
    redirect_uri: `${request.redirect_uri}?${qs.stringify(response)}`
  }
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
    active: output.active,
    expires_in: output.expires_in,
    iat: output.iat,
    iss: output.iss,
    exp: output.exp
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

const token = async (ctx, next) => {
  const request = schema.tokenRequest(ctx.request.body)
  const output = await ctx.service.token(request)
  const response = schema.tokenResponse(output)

  ctx.body = response
  ctx.status = 200
}
// The UserInfo Endpoint MUST support the use of the HTTP GET and HTTP POST methods defined in RFC 2616 [RFC2616].
const userinfo = async (ctx, next) => {
}

export default {
  async getClientConnect (ctx, next) {
    await ctx.render('connect', {
      title: 'Connect'
    })
  },
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
      ctx.body = response
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
  // GET /client-authorize
  // Description: When the client chooses to connect
  // with the provided, the client will trigger an
  // authorize() endpoint from their side which will
  // call the authorizeSDK()
  async getClientAuthorize (ctx, next) {
    const response = await openIdSDK.authorize()
    // The response will be a redirect url
    // to the provider consent screen
    ctx.redirect(response.authorize_uri)
  },
  // GET /client-authorize/callback
  // Description: Once the client has accepted/rejected
  // the connection with the Provider, the client
  // will receive the success/error response
  // at the callback url.
  // The code received here will be traded with a valid access token
  // and can only be used once
  async getClientAuthorizeCallback (ctx, next) {
    try {
      const request = {
        code: ctx.query.code
      }
      // Should have a code
      // to be traded with an access token
      const response = await openIdSDK.authorizeCallback(request)
      // ctx.state.response = response
      ctx.status = 200
      ctx.body = response
      await next()
    } catch (err) {
      // handle error
      console.log(err)
    }
  },
  introspect,
  refresh,
  getAuthorize,
  postAuthorize,
  token,
  checkUser,
  cacheAuthorizationCode

}
