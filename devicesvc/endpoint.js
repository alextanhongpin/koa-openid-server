// endpoint.js

// GET /devices
// Description: Get a list of devices
const getDevices = async(ctx, next) => {
  const request = getDevicesRequest(ctx.request.body)
  if (request.select) {
    // select only devices that are tied to the user's id
  }
  const devices = await ctx.service.getDevices(request)
  const response = getDevicesResponse(devices)
  // do something with the response
  ctx.status = 200
  ctx.body = response
}

// GET /devices/:id
// Description: Get a single device by the device id
const getDevice = async(ctx, next) => {
 // Get a single device by Id
}

// POST /devices
// Description: Create a new device
const postDevice = async (ctx, next) => {
  const request = postDeviceRequest(ctx)
  const device = await ctx.service.postDevice(request)
  const response = postDeviceResponse(device)

  ctx.status = 200
  ctx.body = response
}

// Request/Response
const getDevicesRequest = (req) => {
  return req
}
const getDevicesResponse = (res) => {
  return res
}

const getDeviceRequest = (req) => {
  return req
}

const getDeviceResponse = (res) => {
  return res
}

const postDeviceRequest = (ctx) => {
  return {
    user_id: ctx.request.body.user_id,
    user_agent: ctx.state.userAgent.source
  }
}

const postDeviceResponse = res => res

export default {
  getDevices,
  getDevice,
  postDevice
}
