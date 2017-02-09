// endpoint.js
// Request on the Fly lol
import request from 'request'

class Endpoint {
  // The reason why we avoid form is that the implementation
  // will be tied to web only,
  // If we want to support mobile devices, then it should be able
  // to post login/register to a http endpoint
  async login (ctx, next) {
    try {
      // Parse the request

      const request = ctx.schema.loginRequest(ctx.request.body)
      // Call the sevice
      const user = await ctx.service.login(request)
      user.id = user._id.toString()
      // Parse the response
      const response = ctx.schema.loginResponse(user)

      // Don't forget to add authentication
      const device = await createDevice({
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

      ctx.body = device
      ctx.status = 200
    } catch (err) {
      ctx.status = 400
      ctx.body = {
        error: err.message
      }
    }
  }
}

// TODO:
// 1. add circuit breaker
// 2. add authentication
// class ExternalEndpoint {
function createDevice ({ user_id, user_agent }) {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: 'http://localhost:3100/api/v1/devices',
      headers: {
        'User-Agent': user_agent,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id
      })
    }, (error, httpResponse, body) => {
      if (!error && httpResponse.statusCode === 200) {
        resolve(JSON.parse(body))
      } else {
        reject(error)
      }
    })
  })
}
// }


export default () => {
  return new Endpoint()
}
