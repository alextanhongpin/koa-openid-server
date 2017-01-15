const ErrorUserIdNotProvided = new Error('Unable to identify user')
const ErrorUserAgentNotProvided = new Error('Unable to identify the user agent')

class DeviceInterface {
  getDevices () {
    throw new Error('DeviceInterfaceError: getDevices is not implemented')
  }
  postDevice () {
    throw new Error('DeviceInterfaceError: postDevice is not implemented')
  }
  // ...implements the rest later
}

class DeviceService extends DeviceInterface {
  constructor (props) {
    super(props)
    this.db = props.db
  }
  async getDevices (user_id = '', user_agent = '') {
    // if (!user_id) throw ErrorUserIdNotProvided
    // if (!user_agent) throw ErrorUserAgentNotProvided
    const users = await this.db.find({
      // user_id, user_agent
    })
    return users
  }
  async postDevice ({user_id, user_agent}) {
    console.log('postDevice', user_agent, user_id)
    if (!user_id) throw ErrorUserIdNotProvided
    if (!user_agent) throw ErrorUserAgentNotProvided
    const Device = this.db
    // device.access_token = await device.createAccessToken()

    const device = await this.db.findOne({
      user_id, user_agent
    })
    // No user with the device session
    if (!device) {
      const newDevice = new Device()
      newDevice.user_id = user_id
      newDevice.user_agent = user_agent
      newDevice.access_token = await newDevice.createAccessToken({
        user_id, user_agent
      })
      newDevice.refresh_token = await newDevice.createRefreshToken(32)
      return newDevice.save()
    } else {
      device.access_token = await device.createAccessToken({
        user_id, user_agent
      })
      device.refresh_token = await device.createRefreshToken(32)
      return device.save()
    }
  }

  destroy () {
    return this.db.remove({})
  }
}

// Export a new auth service
export default (options) => {
  return new DeviceService(options)
}
