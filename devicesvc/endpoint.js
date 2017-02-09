
class Endpoint {
  // Implement JSON api
  async all (ctx, next) {
    const request = {}
    const devices = await ctx.service.all(request)
    const response = devices

    ctx.status = 200
    ctx.body = response
  }
  async one (ctx, next) {
    const request = {}
    const device = await ctx.service.one({ _id: ctx.params.id })
    const response = device
    
    ctx.status = 200
    ctx.body = device
  }
  async create (ctx, next) {
    const request = ctx.schema.postDeviceRequest({
      user_id: ctx.request.body.user_id,
      user_agent: ctx.state.userAgent.source
    })
    const device = await ctx.service.create(request)
    const response = ctx.schema.postDeviceResponse(device)

    ctx.status = 200
    ctx.body = response
  }
}

export default () => {
  return new Endpoint()
}