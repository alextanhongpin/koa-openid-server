import request from 'request'

class OpenIdSDK {
  constructor (props) {
    this._clientId = props.clientId
    this._clientSecret = props.clientSecret
    this._introspectEndpoint = props.introspectEndpoint
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
  refresh () {

  }
}

export default (options) => {
  return new OpenIdSDK(options)
}