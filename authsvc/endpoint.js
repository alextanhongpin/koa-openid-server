// endpoint.js
// Request on the Fly lol

// Orchestration of business logic is done here

class Endpoint {
  // The reason why we avoid form is that the implementation
  // will be tied to web only,
  // If we want to support mobile devices, then it should be able
  // to post login/register to a http endpoint
  // Login api is for mobile
  async loginApi (ctx, next) {
    try {
      // Parse the request

      const request = ctx.schema.loginRequest(ctx.request.body)
      // Call the sevice
      const user = await ctx.service.login(request)
      user.id = user._id.toString()
      // Parse the response
      const response = ctx.schema.loginResponse(user)

      // Don't forget to add authentication
      const device = await ctx.externalService.createDevice().fire({
        user_id: user.id,
        user_agent: ctx.state.userAgent.source
      })

      ctx.body = device
      ctx.status = 200
    } catch (err) {
      ctx.status = 400
      ctx.body = {
        error: err.message
      }
    }
  }
  // Login with form (POST)
  async login (ctx, next) {
    try {
      // Parse the request

      const request = ctx.schema.loginRequest(ctx.request.body)
      // Call the sevice
      const user = await ctx.service.login(request)
      user.id = user._id.toString()
      // Parse the response
      const response = ctx.schema.loginResponse(user)

      ctx.redirect('/login/callback?user_id=' + response.id)
    } catch (err) {
      // Handle error logging in
      ctx.redirect('/login/error')
    }
  }

  async loginCallback (ctx, next) {
    const userId = ctx.query.user_id
    // Don't forget to add authentication
    const device = await createDevice({
      user_id: userId,
      user_agent: ctx.state.userAgent.source
    })
    // Set a redirect to the profile page
    ctx.body = Object.assign({}, device, {
      redirect_url: '/profile'
    })
  }

  async registerApi (ctx, next) {
    try {
      const request = ctx.schema.registerRequest(ctx.request.body)
      const user = await ctx.service.register(request)
      user.id = user._id.toString()
      const response = ctx.schema.registerResponse(user)

      const device = await ctx.externalService.createDevice().fire({
        user_id: user.id,
        user_agent: ctx.state.userAgent.source
      })

      ctx.body = device
      ctx.status = 200
    } catch (err) {
      ctx.status = 400
      ctx.body = {
        error: err.message
      }
    }
  }

  async register (ctx, next) {
    try {
      const request = ctx.schema.registerRequest(ctx.request.body)
      const user = await ctx.service.register(request)
      user.id = user._id.toString()
      const response = ctx.schema.registerResponse(user)

      const device = await createDevice({
        user_id: user.id,
        user_agent: ctx.state.userAgent.source
      })

      ctx.redirect('/register/callback?user_id=' + response.id)
    } catch (err) {
      ctx.redirect('/register/error')
    }
  }

  async registerCallback (ctx, next) {
    const userId = ctx.query.user_id
    // Don't forget to add authentication
    const device = await createDevice({
      user_id: userId,
      user_agent: ctx.state.userAgent.source
    })
    // Set a redirect to the profile page
    ctx.body = Object.assign({}, device, {
      redirect_url: '/profile'
    })
  }

  async loginView (ctx, next) {
    await ctx.render('login', {
      title: 'Login',
      csrf: ctx.csrf
    })
  }

  // Register Endpoints
  async registerView (ctx, next) {
    await ctx.render('register', {
      title: 'Register'
    })
  }
}

// TODO:
// 1. add circuit breaker
// 2. add authentication
// class ExternalEndpoint {

// }


export default () => {
  return new Endpoint()
}
