// endpoint.js
import qs from 'querystring'
import redis from '../common/redis.js'
import JWT from '../modules/jwt'
import Base64 from '../modules/base64.js'
import Log from '../modules/log.js'

const base64 = Base64()
const jwt = JWT()
const log = Log('oauthsvc')

const ErrorInvalidContentType = new Error('Invalid Content-Type: Content-Type must be application/json')
const ErrorBasicAuthorizationMissing = new Error('Invalid Request: Basic authorization header is required')
const ErrorForbiddenAccess = new Error('Forbidden Access: Client does not have permission to access this service')
const ErrorInvalidRedirectURL = new Error('Error: Invalid redirect url')
const ErrorClientDoNotExist = new Error('Error: Client does not exist')
const ErrorInvalidScope = new Error('Bad Request: Invalid scope')

class Endpoint {
  async getAuthorize (ctx, next) {
    try {
      const request = ctx.schema.authorizeRequest(ctx.query)
      const client = await ctx.service.callClient({ client_id: request.client_id })

      if (!client) {
        const error = ErrorClientDoNotExist
        error.description = 'The client is not found or have been deleted'
        error.redirect_uri = request.redirect_uri
        throw error
      }

      const uriSet = new Set(client.redirect_uris)
      if (!uriSet.has(request.redirect_uri)) {
        const error = ErrorInvalidRedirectURL
        error.description = 'The redirect uri provided does not match the client redirect uri'
        error.redirect_uri = request.redirect_uri
        throw error
      }

      request.scope.forEach((scope) => {
        if (!client.scope.contains(scope)) {
          const error = ErrorInvalidScope
          error.description = `The scope ${scope} is not allowed`
          error.redirect_uri = request.redirect_uri
          throw error
        }
      })

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

  // postAuthorize
  async postAuthorize (ctx, next) {
    const request = ctx.schema.authorizeRequest(ctx.request.body)

    const client = await ctx.externalService.callClient({ client_id: request.client_id })

    if (!client) {
      const error = ErrorClientDoNotExist
      error.description = 'The client is not found or have been deleted'
      error.redirect_uri = request.redirect_uri
      throw error
    }

    const uriSet = new Set(client.redirect_uris)
    if (!uriSet.has(request.redirect_uri)) {
      const error = ErrorInvalidRedirectURL
      error.description = 'The redirect uri provided does not match the client redirect uri'
      error.redirect_uri = request.redirect_uri
      throw error
    }

    request.scope.forEach((scope) => {
      if (!client.scope.contains(scope)) {
        const error = ErrorInvalidScope
        error.description = `The scope ${scope} is not allowed`
        error.redirect_uri = request.redirect_uri
        throw error
      }
    })

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
  async introspect (ctx, next) {
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

  async token (ctx, next) {
    const request = ctx.schema.tokenRequest(ctx.request.body)
    const output = await ctx.service.token(request)
    const response = ctx.schema.tokenResponse(output)

    ctx.body = response
    ctx.status = 200
  }

  // The UserInfo Endpoint MUST support the use of the HTTP GET and HTTP POST methods defined in RFC 2616 [RFC2616].
  async userinfo (ctx, next) {}

  // Refresh the access token by providing a new access token if the provided refresh token is valid
  async refresh (ctx, next) {
    // Business-rule-validation
    if (!(ctx.headers['content-type'] === 'application/x-www-form-urlencoded')) {
      ctx.throw('Bad Request', 400, {
        description: ErrorInvalidContentType.message
      })
    }
    const authorizationHeader = ctx.headers.authorization
    const [ authType, authToken ] = authorizationHeader.split(' ')

    // Should it be `bearer` or `basic`?
    if (authType !== 'Bearer') {
      ctx.throw('Bad Request', 400, {
        description: ErrorBasicAuthorizationMissing.message
      })
    }

    log.debug('refresh', 'authToken', authToken)

    // const token = await jwt.verify(authToken)
    // log.debug('refresh', 'token', token)

    const authTokenValidated = base64.decode(authToken)

    log.debug('refresh', 'authTokenValidated', authTokenValidated)

    const [ clientId, clientSecret ] = authTokenValidated.split(':')
    if (!clientId || !clientSecret) {
      ctx.throw('Forbidden Access', 403, {
        description: ErrorForbiddenAccess.message
      })
    }

    log.debug('refresh', 'clientId', clientId)
    log.debug('refresh', 'clientSecret', clientSecret)
    const request = ctx.schema.refreshTokenRequest({
      grant_type: ctx.request.body.grant_type,
      refresh_token: ctx.request.body.refresh_token,
      scope: ctx.request.body.scope,
      redirect_uri: ctx.request.body.redirect_uri
    })

    console.log('oauthsvc:endpoint:refresh: request => ', request)
    // Fire external service
    const client = await this.service.callClients({ client_id: clientId, client_secret: clientSecret })
    if (!client) {
      throw new Error('Forbidden Access: Client does not have permission to access this service')
    }

    const device = await ctx.service.callDeviceByRefreshToken({
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

        const output = await ctx.service.callUpdateDevice({
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

  async configuration (ctx, next) {
    const request = ctx.schema.configurationRequest(ctx.query)
    const user = ctx.user.configuration(request)
    const response = ctx.schema.configurationResponse(user)

    ctx.status = 200
    ctx.body = response
  }

  // carry out validation to see if the user has authorization for the api
  async checkUser (ctx, next) {
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
}

export default (props) => {
  return new Endpoint(props)
}
