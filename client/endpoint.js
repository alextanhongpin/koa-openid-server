/*
 * client/endpoint.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 19/2/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

import SDK from '../modules/openidsdk.js'

const sdk = SDK({
  clientID: 'jHS3sWTkO4u3sIAMWcj_0smNhndmmKrRZHfmt00D0Mg',
  clientSecret: 'jHS3sWTkO4u3sIAMWcj_0smNhndmmKrRZHfmt00D0Mg-kAavdMCWhLnvLXok',
  scope: ['openid', 'email'],
  redirectURL: 'http://localhost:3100/client-authorize/callback',
  authURL: 'http://localhost:3100/authorize',
  tokenURL: 'http://localhost:3100/token',
  requestURL: 'http://localhost:3100/token/refresh',
  introspectURL: 'http://localhost:3100/token/introspect',
  code: ''
})

// GET /
class Endpoint {
  async home (ctx, next) {
    await ctx.render('home', {
      title: 'Home'
    })
  }
  async profile (ctx, next) {
    await ctx.render('profile', {
      title: 'Profile'
    })
  }

  async clientConnect (ctx, next) {
    await ctx.render('connect', {
      title: 'Connect'
    })
  }

  async authorize (ctx, next) {
    const response = await sdk.authorize()
    ctx.redirect(response.authorize_uri)
  }

  async authorizeCallback (ctx, next) {
    const request = {
      code: ctx.query.code
    }
    // Should have a code
    // to be traded with an access token
    const response = await sdk.authorizeCallback(request)
    // ctx.state.response = response
    ctx.status = 200
    ctx.body = response
    await next()
  }
  // POST /client-introspect
  async introspect (ctx, next) {
    // Fires a middleware sdk to introspect the token
    try {
      const response = await sdk.introspect({
        token_type_hint: ctx.request.body.token_type_hint,
        token: ctx.request.body.token
      })
      // Success Response
      ctx.status = 200
      ctx.body = response
    } catch (error) {
      // Error response
      ctx.status = 200
      ctx.body = {
        active: false
      }
    }
  }
  async refreshToken (ctx, next) {
    const response = await openIdSDK.refresh({
      refresh_token: ctx.request.body.refreshToken
    })
    ctx.status = 200
    ctx.body = response
  }
}

export default () => {
  return new Endpoint()
}
