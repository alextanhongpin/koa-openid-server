// Create an interface

// The authentication interface
class AuthInterface {
  login () {
    throw new Error('AuthInterfaceError: login is not implemented')
  }
  logout () {
    throw new Error('AuthInterfaceError: logout is not implemented')
  }
  register () {
    throw new Error('AuthInterfaceError: login is not implemented')
  }
}

const ErrorUserNotFound = new Error('User not Found')
const ErrorIncorrectPassword = new Error('The password is incorrect')
const ErrorInvalidEmail = new Error('The email format is incorrect')
const ErrorEmailNotProvided = new Error('Email is required')
const ErrorPasswordNotProvided = new Error('Password is required')
const ErrorUserIdNotProvided = new Error('User id is required')
const ErrorUserAgentNotProvided = new Error('User agent is required')

class AuthService extends AuthInterface {
  constructor (props) {
    super(props)
    this.db = props.db
  }
  async login (email, password) {
    if (!email) throw ErrorEmailNotProvided
    if (!password) throw ErrorPasswordNotProvided

    const user = await this.db.findOne({ email })

    if (!user) {
      throw ErrorUserNotFound
    } else {
      const isSamePassword = await user.comparePassword(password)
      if (!isSamePassword) {
        throw ErrorIncorrectPassword
      } else {
        return user
      }
    }
  }
  async register (email, password) {
    if (!email) throw ErrorEmailNotProvided
    if (!password) throw ErrorPasswordNotProvided

    const user = await this.db.findOne({ email })
    if (user) {
      return user
    } else {
      const User = this.db
      const user = new User()
      user.email = email
      user.password = await user.hashPassword(password)
      await user.save()
      return user
    }
  }
  logout () {
    // TODO: Clears the user's token/device from the database
  }
  async createDevice (user_id, user_agent) {
    if (!user_id) throw ErrorUserIdNotProvided
    if (!user_agent) throw ErrorUserAgentNotProvided

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

// Export a new auth service
export default (options) => {
  return new AuthService(options)
}
