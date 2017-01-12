import request from 'request'
import base64 from './base64.js'
import qs from 'querystring'

class OpenIdSDK {
  constructor (props) {
    this._clientId = props.clientId
    this._clientSecret = props.clientSecret
    this._scope = props.scope
    this._redirectURI = props.redirectURI
    this._introspectEndpoint = props.introspectEndpoint
    this._authorizeEndpoint = props.authorizeEndpoint
    this._tokenEndpoint = props.tokenEndpoint
    this._refreshTokenEndpoint = props.refreshTokenEndpoint
    this._refreshTokenCallback = props.refreshTokenCallback
  }
  // Introspect a token's status to see if it's valid
  introspect ({ token, token_type_hint }) {
    return new Promise((resolve, reject) => {
      request(this._introspectEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64.encode([this._clientId, this._clientSecret].join(':'))}`
        },
        form: {
          token_type_hint,
          token
        }
      }, (err, res, body) => {
        if (err) {
          reject(err)
        } else if (res.statusCode === 400) {
          reject(JSON.parse(body))
        } else {
          resolve(JSON.parse(body))
        }
      })
    })
  }
  // Issue a new access token based on the refresh token
  refresh ({ grant_type='refresh_token', refresh_token, scope, redirect_uri }) {
    return new Promise((resolve, reject) => {
      request(this._refreshTokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64.encode([this._clientId, this._clientSecret].join(':'))}`
        },
        form: {
          grant_type,
          refresh_token,
          scope,
          redirect_uri
        }
      }, (err, res, body) => {
        if (err) {
          reject(err)
        } else if (res.statusCode === 400) {
          reject(JSON.parse(body))
        } else {
          resolve(JSON.parse(body))
        }
      })
    })
  }
  authorize () {
    const baseUri = this._authorizeEndpoint
    const query = qs.stringify({
      response_type: ['code'],
      scope: this._scope,
      client_id: this._clientId,
      redirect_uri: this._redirectURI
    })
    return Promise.resolve({
      authorize_uri: `${baseUri}?${query}`
    })
  }
  // Module specific for Koa
  authorizeCallback ({ code }) {
    return new Promise((resolve, reject) => {
      request(this._tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64.encode([this._clientId, this._clientSecret].join(':'))}`
        },
        form: {
          code,
          grant_type: 'authorization_code'
        }
      }, (err, res, body) => {
        if (err) {
          reject(err)
        } else if (res.statusCode === 400) {
          reject(JSON.parse(body))
        } else {
          resolve(JSON.parse(body))
        }
      })
    })
  }
}

export default (options) => {
  return new OpenIdSDK(options)
}