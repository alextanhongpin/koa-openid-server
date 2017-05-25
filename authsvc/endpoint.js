/*
 * authsvc/endpoint.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 19/2/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

//
// README
//
// * Orchestration of business logic is done here
// * External services are prefixed with `external`
// * Circuit breaker will be applied to external services
//

import circuitBreaker from '../common/circuit.js'

class Endpoint {
  // NOTE: This doesn't work because the `this` does not bind to the context
  // constructor ({ service, schema }) {
  //   this.service = service
  //   this.schema = schema
  // }
  // NOTE: Forms are not mobile-friendly
  // Login api endpoint
  async loginApi (ctx, next) {
    // NOTE: Bonus points if you return the HTTP 429 status code with the standard Retry-After header on rejected requests ;)

    // Validate request body
    const request = ctx.schema.loginRequest(ctx.request.body)

    const user = await ctx.service.login(request)
    // ._id returned from mongodb is an object - parse to string
    user.id = user._id.toString()

    // Validate response payload
    const response = ctx.schema.loginResponse(user)

    // Make an external call to register the device
    const device = await circuitBreaker(ctx.service.callCreateDevice, {
      user_id: user.id,
      user_agent: ctx.state.userAgent.source
    })
    ctx.body = device
    ctx.status = 200
  }

  // Login form
  async login (ctx, next) {
    try {
      const request = ctx.schema.loginRequest(ctx.request.body)
      const user = await ctx.service.login(request)
      user.id = user._id.toString()
      const response = ctx.schema.loginResponse(user)

      ctx.redirect(`/login/callback?user_id=${response.id}`)
    } catch (error) {
      // Wrong login attempt?
      ctx.redirect('/login/error')
    }
  }

  // Login callback
  async loginCallback (ctx, next) {
    const userId = ctx.query.user_id
    const device = circuitBreaker(ctx.service.callCreateDevice, {
      user_id: userId,
      user_agent: ctx.state.userAgent.source
    })
    // Set a redirect to the profile page
    await ctx.render('login-callback', {
      ...device,
      redirect_url: '/profile'
    })
  }

  // Register api
  async registerApi (ctx, next) {
    const request = ctx.schema.registerRequest(ctx.request.body)

    const user = await ctx.service.register(request)
    user.id = user._id.toString()

    const response = ctx.schema.registerResponse(user)
    const device = await circuitBreaker(ctx.service.externalCreateDevice, {
      user_id: user.id,
      user_agent: ctx.state.userAgent.source
    })

    ctx.body = device
    ctx.status = 200
  }

  // Register form
  async register (ctx, next) {
    try {
      const request = ctx.schema.registerRequest(ctx.request.body)

      const user = await ctx.service.register(request)
      user.id = user._id.toString()

      const response = ctx.schema.registerResponse(user)

      ctx.redirect(`/register/callback?user_id=${response.id}`)
    } catch (err) {
      ctx.redirect('/register/error')
    }
  }

  // Register callback
  async registerCallback (ctx, next) {
    const userId = ctx.query.user_id
    const device = circuitBreaker(ctx.service.externalCreateDevice, {
      user_id: userId,
      user_agent: ctx.state.userAgent.source
    })
    await ctx.render('register-callback', {
      ...device,
      redirect_url: '/profile'
    })
  }

  // Login view
  async loginView (ctx, next) {
    await ctx.render('login', {
      title: 'Login',
      csrf: ctx.csrf
    })
  }

  // Register view
  async registerView (ctx, next) {
    await ctx.render('register', {
      title: 'Register',
      csrf: ctx.csrf
    })
  }
}

// We do this to avoid the new keyword
export default () => {
  return new Endpoint()
}
