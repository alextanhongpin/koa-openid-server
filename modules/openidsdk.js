import request from 'request'
import base64 from './base64.js'
import qs from 'querystring'

// import OpenIdSDK from '../modules/openidsdk.js'

// The SDK is used on the client side to make requests to the openid endpoints
// var SDK = {
//   clientID: 'jHS3sWTkO4u3sIAMWcj_0smNhndmmKrRZHfmt00D0Mg',
//   clientSecret: 'jHS3sWTkO4u3sIAMWcj_0smNhndmmKrRZHfmt00D0Mg-kAavdMCWhLnvLXok',
//   scope: ['openid', 'email'],
//   redirectURL: 'http://localhost:3100/client-authorize/callback',
//   authURL: 'http://localhost:3100/authorize',
//   tokenURL: 'http://localhost:3100/token',
//   requestURL: 'http://localhost:3100/token/refresh',
//   introspectURL: 'http://localhost:3100/token/introspect',
//   code: ''
// }

class SDK {
  constructor ({
      clientID,
      clientSecret,
      scope,
      redirectURL,
      authURL,
      tokenURL,
      requestURL,
      introspectURL,
      code
    }) {
    this.clientID = clientID
    this.clientSecret = clientSecret
    this.scope = scope
    this.redirectURL = redirectURL
    this.authURL = authURL
    this.tokenURL = tokenURL
    this.requestURL = requestURL
    this.introspectURL = introspectURL
    this.code = code

    this.AUTHORIZATION_CODE = 'authorization_code'
  }

  // introspect validates if the token is still valid for a particular user
  introspect ({ token, token_type_hint = 'access_token' }) {
    return new Promise((resolve, reject) => {
      request(this.introspectURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64.encode([this.clientID, this.clientSecret].join(':'))}`
        },
        form: {
          token,
          token_type_hint
        }
      }, (error, response, body) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 400) {
          reject(JSON.parse(body))
        } else {
          resolve(JSON.parse(body))
        }
      })
    })
  }

    // refresh will issue a new access token based on the refresh token
  refresh ({ grant_type = 'refresh_token', refresh_token }) {
    return new Promise((resolve, reject) => {
      request(this.requestURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64.encode([this.clientID, this.clientSecret].join(':'))}`
        },
        form: {
          grant_type,
          refresh_token,
          scope: this.scope,
          redirect_uri: this.redirectURL
        }
      }, (error, response, body) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 400) {
          reject(JSON.parse(body))
        } else {
          resolve(JSON.parse(body))
        }
      })
    })
  }

  // authorize will redirect the user to the authorization page
  authorize () {
    const baseUri = this.authURL
    const query = qs.stringify({
      response_type: ['code'],
      scope: this.scope,
      client_id: this.clientID,
      redirect_uri: this.redirectURL
    })
    return Promise.resolve({
      authorize_uri: `${baseUri}?${query}`
    })
  }

  // Module specific for Koa
  authorizeCallback ({ code }) {
    return new Promise((resolve, reject) => {
      request(this.tokenURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64.encode([this.clientID, this.clientSecret].join(':'))}`
        },
        form: {
          code,
          grant_type: this.AUTHORIZATION_CODE
        }
      }, (error, response, body) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 400) {
          reject(JSON.parse(body))
        } else {
          try {
            const res = JSON.parse(body)
            resolve(res)
          } catch (error) {
            reject(body)
          }
        }
      })
    })
  }
}

export default (options) => {
  return new SDK(options)
}
