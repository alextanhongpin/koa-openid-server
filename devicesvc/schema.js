import Toolbox from '../common/toolbox.js'

const parser = Toolbox({
  allErrors: true,
  removeAdditional: true,
  schemas: [
    require('./schema/get-devices-request.json'),
    require('./schema/get-devices-response.json'),
    require('./schema/get-device-request.json'),
    require('./schema/get-device-response.json'),
    require('./schema/post-device-request.json'),
    require('./schema/post-device-response.json')
  ]
})

export default {
  getDevicesRequest: parser.parse('http://localhost:3000/schemas/get-devices-request.json#'),
  getDevicesResponse: parser.parse('http://localhost:3000/schemas/get-devices-response.json#'),
  getDeviceRequest: parser.parse('http://localhost:3000/schemas/get-device-request.json#'),
  getDeviceResponse: parser.parse('http://localhost:3000/schemas/get-device-response.json#'),
  postDeviceRequest: parser.parse('http://localhost:3000/schemas/post-device-request.json#'),
  postDeviceResponse: parser.parse('http://localhost:3000/schemas/post-device-response.json#')
}
