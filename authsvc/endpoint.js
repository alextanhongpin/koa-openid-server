// endpoint.js
// import noderequest from 'request'

class Endpoint {
  async getLogin (ctx, next) {
    await ctx.render('login', {
      title: 'Login'
    })
  }
  // The reason why we avoid form is that the implementation
  // will be tied to web only,
  // If we want to support mobile devices, then it should be able
  // to post login/register to a http endpoint
  async postLogin (ctx, next) {
    try {
      // Parse the request

      const request = ctx.schema.loginRequest(ctx.request.body)
      // Call the sevice
      const user = await ctx.service.login(request)
      user.id = user._id.toString()
      // Parse the response
      const response = ctx.schema.loginResponse(user)
      // 
      // Publish to a message broker to create a new device
      const device = await ctx.broker.producer({
        payload: {
          user_id: user.id,
          user_agent: ctx.state.userAgent.source
        },
        id: user.id
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
  // Register Endpoints
  async getRegister (ctx, next) {
    await ctx.render('register', {
      title: 'Register'
    })
  }

  async postRegister(ctx, next) {
    try {
      const request = ctx.schema.registerRequest(ctx.request.body)
      const user = await ctx.service.register(request)
      const response = ctx.schema.registerResponse({
        email: user.email
      })
      // CLIENT
      const message = JSON.stringify({
        user_id: user.id,
        user_agent: ctx.state.userAgent.source
      })
      const device = await ctx.broker.producer({
        payload: message,
        id: user.id
      })
      // const chan = await ctx.channel()
      ctx.body = device// await publishDevice({ chan, message, user_id: user._id.toString() })
      ctx.status = 200
    } catch (err) {
      ctx.redirect('/login?error=' + err.message)
    }
  }
}


export default () => {
  return new Endpoint()
}
