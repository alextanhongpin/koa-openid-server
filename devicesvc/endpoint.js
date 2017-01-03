// endpoint.js

// GET /devices
// Description: Get a list of devices
const getDevices = async(ctx, next) => {
  const request = getDevicesRequest(ctx.request.body)
  
  if (request.select) {
    // select only devices that are tied to the user's id
  }
  const devices = ctx.service.getDevices(request)
  const response = getDevicesResponse(devices)
  // do something with the response
  this.status = 200
  this.body = response
}

// GET /devices/:id
// Description: Get a single device by the device id
const getDevice = async(ctx, next) => {
 // Get a single device by Id 
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

export default {
  getDevices,
  getDevice
}
