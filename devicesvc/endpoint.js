
class Endpoint {
  // Implement JSON api
  // Add pagination, meta
  async all (ctx, next) {
    const request = ctx.schema.getDevicesRequest({})
    const devices = await ctx.service.all(request)
    const response = devices

    ctx.status = 200
    ctx.body = response
  }
  async one (ctx, next) {
    const request = ctx.schema.getDeviceRequest({ id: ctx.params.id })
    const device = await ctx.service.one(request)
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
  async healthCheck (ctx, next) {
    ctx.status = 200
    ctx.body = {
      ok: true
    }
  }
}

export default () => {
  return new Endpoint()
}
