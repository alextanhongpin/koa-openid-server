// endpoint.js

export default class Endpoint {
  // async getDevices (ctx, next) {
  //   const request = getDevicesRequest(ctx.request.body)
  //   if (request.select) {
  //     // select only devices that are tied to the user's id
  //   }
  //   const devices = await ctx.service.getDevices(request)
  //   const response = getDevicesResponse(devices)

  //   ctx.status = 200
  //   ctx.body = response
  // } 
  async postDevice (ctx, next) {
    const request = ctx.schema.postDeviceRequest({
      user_id: ctx.request.body.user_id,
      user_agent: ctx.state.userAgent.source
    })
    const device = await ctx.service.postDevice(request)
    const response = ctx.schema.postDeviceResponse(device)

    ctx.status = 200
    ctx.body = response
  }
}
