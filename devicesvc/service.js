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
  async postDevice (user_id, user_agent) {
    if (!user_id) throw ErrorUserIdNotProvided
    if (!user_agent) throw ErrorUserAgentNotProvided
    const Device = this.db
    const device = new Device()
    // device.access_token = await device.createAccessToken()

    // const user = await this.db.findOne({
    //   _id: user_id,
    //   'devices.user_agent': { $ne: user_agent }
    // })
    // // if exist
    // if (user) {
    //   const response = await user.update({
    //     _id: user_id
    //   }, {
    //     $addToSet: {
    //       devices: {
    //         access_token: await user.createAccessToken({ user_id, user_agent }),
    //         refresh_token: await user.createRefreshToken(32),
    //         user_agent: user_agent
    //       }
    //     }
    //   })
    // }
    // return response
  }
}
