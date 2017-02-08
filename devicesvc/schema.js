import Toolbox from '../common/toolbox.js'

const parser = Toolbox({
  allErrors: true,
  schemas: [
    require('./schema/post-device-request.json'),
    require('./schema/post-device-response.json')
  ]
})

export default {
  postDeviceRequest: parser.parse('http://localhost:3000/schemas/post-device-request.json#'),
  postDeviceResponse: parser.parse('http://localhost:3000/schemas/post-device-response.json#')
}
