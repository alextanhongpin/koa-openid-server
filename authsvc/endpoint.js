// authsvc/endpoint.js

// 1. Orchestration of business logic is done here
// 2. External services are prefixed with `external`
// 3. Circuit breaker will be applied to external services
import circuitBreaker from '../common/circuit.js'

class Endpoint {
  // The reason why we avoid form is that the implementation
  // will be tied to web only,
  // If we want to support mobile devices, then it should be able
  // to post login/register to a http endpoint
  // Login api is for mobile
  async loginApi (ctx, next) {
    // Check if the user is allowed to call the login (is not blocked)
    // If true: continue
    // Else: redirect to error page
    // Bonus points if you return the HTTP 429 status code with the standard Retry-After header on rejected requests ;)
      // Parse the request
    const request = ctx.schema.loginRequest(ctx.request.body)
    const user = await ctx.service.login(request)
    user.id = user._id.toString()

    const response = ctx.schema.loginResponse(user)

    const device = await circuitBreaker(ctx.service.callCreateDevice, {
      user_id: user.id,
      user_agent: ctx.state.userAgent.source
    })
    ctx.body = device
    ctx.status = 200
  }
  // Login with form (POST)
  async login (ctx, next) {
    try {
      const request = ctx.schema.loginRequest(ctx.request.body)
      const user = await ctx.service.login(request)
      user.id = user._id.toString()
      const response = ctx.schema.loginResponse(user)

      ctx.redirect('/login/callback?user_id=' + response.id)
    } catch (error) {
      // Wrong login attempt?
      ctx.redirect('/login/error')
    }
  }

  async loginCallback (ctx, next) {
    const userId = ctx.query.user_id
    const device = circuitBreaker(ctx.service.callCreateDevice, {
      user_id: userId,
      user_agent: ctx.state.userAgent.source
    })
    // Set a redirect to the profile page
    await ctx.render('login-callback', Object.assign({}, device, {
      redirect_url: '/profile'
    }))
  }

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

  async register (ctx, next) {
    try {
      const request = ctx.schema.registerRequest(ctx.request.body)
      const user = await ctx.service.register(request)
      user.id = user._id.toString()
      const response = ctx.schema.registerResponse(user)

      ctx.redirect('/register/callback?user_id=' + response.id)
    } catch (err) {
      ctx.redirect('/register/error')
    }
  }

  async registerCallback (ctx, next) {
    const userId = ctx.query.user_id
    const device = circuitBreaker(ctx.service.externalCreateDevice, {
      user_id: userId,
      user_agent: ctx.state.userAgent.source
    })
    await ctx.render('register-callback', Object.assign({}, device, {
      redirect_url: '/profile'
    }))
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
      title: 'Register',
      csrf: ctx.csrf
    })
  }
}

export default () => {
  return new Endpoint()
}
