// endpoint.js
import qs from 'querystring'
import redis from '../common/redis.js'
import jwt from '../modules/jwt'
import base64 from '../modules/base64.js'
import OpenIdSDK from '../modules/openidsdk.js'

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

const ErrorInvalidContentType = new Error('Invalid Content Type: Content-Type must be application/json')
const ErrorBasicAuthorizationMissing = new Error('Invalid Request: Basic authorization header is required')
const ErrorForbiddenAccess = new Error('Forbidden Access: Client does not have permission to access this service')

class Endpoint {
  async getAuthorize (ctx, next) {
    try {
      const request = ctx.schema.authorizeRequest(ctx.query)
      const client = await ctx.externalService.getOneClient({ client_id: request.client_id })

      if (!client) {
        const errorClientDoNotExist = new Error('Forbidden')
        errorClientDoNotExist.description = 'The client is not found or have been deleted'
        errorClientDoNotExist.redirect_uri = request.redirect_uri
        throw errorClientDoNotExist
      }

      const uriSet = new Set(client.redirect_uris)
      if (!uriSet.has(request.redirect_uri)) {
        const errorInvalidRedirectURI = new Error('Invalid Request')
        errorInvalidRedirectURI.description = 'The redirect uri provided does not match the client redirect uri'
        errorInvalidRedirectURI.redirect_uri = request.redirect_uri
        throw errorInvalidRedirectURI
      }
      if (client.scope !== scope) {
        // Do checking for the scopes
      }
      // Authorize response

      await ctx.render('consent', {
        title: 'Consent',
        client: client,
        // NOTE: can be masked with additional jwt for security
        request: JSON.stringify(request)
      })
    } catch (error) {
      const query = qs.stringify({
        error: error.message,
        error_description: error.description
      })
      return ctx.redirect(`${error.redirect_uri}?${query}`)
    }
  }
  async postAuthorize (ctx, next) {
    const request = ctx.schema.authorizeRequest(ctx.request.body)
    
    const client = await ctx.externalService.getOneClient({ client_id: request.client_id })

    if (!client) {
      // Client does not exist error
      const errorClientDoNotExist = new Error('Forbidden')
      errorClientDoNotExist.description = 'The client is not found or have been deleted'
      errorClientDoNotExist.redirect_uri = request.redirect_uri
      throw errorClientDoNotExist
    }
    const uriSet = new Set(client.redirect_uris)
    if (!uriSet.has(request.redirect_uri)) {
      const errorInvalidRedirectURI = new Error('Invalid Request')
      errorInvalidRedirectURI.description = 'The redirect uri provided does not match the client redirect uri'
      errorInvalidRedirectURI.redirect_uri = request.redirect_uri
      throw errorInvalidRedirectURI
    }

    if (client.scope !== scope) {

    }

    const output = await ctx.service.authorization(request)
    const response = ctx.schema.authorizeResponse(output)
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
  async introspect(ctx, next) {
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
    const request = ctx.schema.introspectRequest({
      token: ctx.request.body.token,
      token_type_hint: ctx.request.body.token_type_hint
    })
    const output = await ctx.service.introspect(request)
    const response = ctx.schema.introspectResponse({
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

  async token(ctx, next) {
    const request = ctx.schema.tokenRequest(ctx.request.body)
    const output = await ctx.service.token(request)
    const response = ctx.schema.tokenResponse(output)

    ctx.body = response
    ctx.status = 200
  }

  // The UserInfo Endpoint MUST support the use of the HTTP GET and HTTP POST methods defined in RFC 2616 [RFC2616].
  async userinfo(ctx, next) {}

  async refresh(ctx, next) {
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
    const request = ctx.schema.refreshTokenRequest({
      grant_type: ctx.request.body.grant_type,
      refresh_token: ctx.request.body.refresh_token,
      scope: ctx.request.body.scope,
      redirect_uri: ctx.request.body.redirect_uri
    })
    // Fire external service
    // const client = await this.service.getClient({ clientId, clientSecret })
    // if (!client) {
    //   throw new Error('Forbidden Access: Client does not have permission to access this service')
    // }
    const device = await ctx.externalService.deviceByRefreshToken({
      refresh_token
    })
    if (device) {
      if (device.user_agent !== ctx.state.userAgent) {
        // Error: Unrecognized device
        const error = new Error('Error: Unrecognized device')
        error.code = 400
        error.description = 'No device registered with the refresh token'
        throw error
      } else {
        // Create new access token
        const accessToken = await ctx.service.refresh(device)

        const output = await ctx.externalService.updateDevice({
          _id: device._id,
          params: {
            access_token: accessToken
          }
        })
        // const output = await ctx.service.refresh(request)
        const response = ctx.schema.refreshTokenResponse({
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
    } else {
      // Error: No device found
      const error = new Error('Error: Device not found')
      error.code = 400
      error.description = 'The device is not found'
      throw error
    }
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

    const FIVE_MINUTES = 300
    const value = `authcode:user:${ctx.state.response.code}`
    redis.set(value, ctx.state.user_id)
    redis.expire(value, FIVE_MINUTES)

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


// export default {
//   introspect,
//   refresh,
//   getAuthorize,
//   postAuthorize,
//   token,
//   checkUser,
//   cacheAuthorizationCode

// }
export default (props) => {
  return new Endpoint(props)
}
