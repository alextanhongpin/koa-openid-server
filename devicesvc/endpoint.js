/*
 * devicesvc/endpoint.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 25/5/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

class Endpoint {
  // TODO: Implement JSON api
  // TODO: Add pagination, meta fields, links

  // Get a list of devices
  async all (ctx, next) {
    const request = ctx.schema.getDevicesRequest({})
    const devices = await ctx.service.all(request)
    const response = devices

    ctx.status = 200
    ctx.body = response
  }

  // Get a device by id
  async one (ctx, next) {
    const request = ctx.schema.getDeviceRequest({ id: ctx.params.id })
    const device = await ctx.service.one(request)
    const response = device

    ctx.status = 200
    ctx.body = response
  }

  // Create a new device
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

  // Check if the service is running
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
