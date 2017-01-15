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
// const ErrorUserIdNotProvided = new Error('User id is required')
// const ErrorUserAgentNotProvided = new Error('User agent is required')

class AuthService extends AuthInterface {
  constructor (props) {
    super(props)
    this.db = props.db
  }
  async login (email, password) {
    console.log('service.login', email, password)
    const user = await this.db.findOne({ email })
    console.log(user)
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
    const user = await this.db.findOne({ email })
    if (user) {
      return user
    } else {
      const User = this.db
      const user = new User()
      user.email = email
      user.password = await User.hashPassword(password)
      await user.save()
      return user
    }
  }
  logout () {
    // TODO: Clears the user's token/device from the database
  }

}

// Export a new auth service
export default (options) => {
  return new AuthService(options)
}
