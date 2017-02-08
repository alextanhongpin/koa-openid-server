import ServiceInterface from '../common/service.js'

class DeviceService extends ServiceInterface {
  async create ({ user_id, user_agent }) {
    const Device = this.db

    const device = await Device.findOne({
      user_id, user_agent
    })
    const accessToken = await Device.createAccessToken({
      user_id, user_agent
    })
    const refreshToken = await Device.createRefreshToken(32)
    // No such device
    if (!device) {
      // Create new device
      const newDevice = new Device()
      newDevice.user_id = user_id
      newDevice.user_agent = user_agent
      newDevice.access_token = accessToken
      newDevice.refresh_token = refreshToken

      await newDevice.save()

      return newDevice.toJSON()
    } else {
      // Device already exists, update params
      device.access_token = accessToken
      device.refresh_token = refreshToken

      await device.save()

      console.log('device', device)

      return device.toJSON()
    }
  }
}

// Export a new auth service
export default (options) => {
  return new DeviceService(options)
}
