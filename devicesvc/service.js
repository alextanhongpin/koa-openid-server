const ErrorUserIdNotProvided = new Error('Unable to identify user')
const ErrorUserAgentNotProvided = new Error('Unable to identify the user agent')


class DeviceService {
  constructor (props) {
    this.db = props.db
  }
  // async getDevices (user_id = '', user_agent = '') {
  //   const users = await this.db.find({
  //   })
  //   return users
  // }
  async postDevice ({ user_id, user_agent }) {
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

      return newDevice
    } else {
      // Device already exists, update params
      device.access_token = accessToken
      device.refresh_token = refreshToken

      await device.save()

      return device
    }
  }
}

// Export a new auth service
export default (options) => {
  return new DeviceService(options)
}
