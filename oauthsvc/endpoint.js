// endpoint.js
import base64 from '../modules/base64.js'
import postIntrospect from './endpoints/introspect-post.js'
import requestService from 'request'

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
  // The client is the one making the request
  // The call must be invoked on the server side to include the
  // client secret in the header
const IntrospectSDK = ({ token_type_hint, token }) => {

  const client_id = 'Q_vcpNiuGw_LBxvg1MPzbbA6XGlT2abvLoPROLP61rA'
  const client_secret = 'FK07NzrgbGmkbwLkuF0Pu_Gzvk-kAavdMCWhLnvLXok'
  const introspect_endpoint = 'http://localhost:3100/token/introspect'

  return new Promise((resolve, reject) => {
    requestService(introspect_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64.encode([client_id, client_secret].join(':'))}`
      },
      form: {
        token_type_hint,
        token
      }
    }, (err, res, body) => {
      // do something
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

export default {
  // POST /client-introspect
  async postClientIntrospect (ctx, next) {
    console.log('postClientIntrospect')
    // Fires a middleware sdk to introspect the token
    try {
      const response = await IntrospectSDK({
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
  postIntrospect,
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
