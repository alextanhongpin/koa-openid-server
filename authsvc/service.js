// Create an interface

// The authentication interface
class AuthInterface {
  login () {
    throw new Error('AuthInterfaceError: method login() is not implemented')
  }
  logout () {
    throw new Error('AuthInterfaceError: method logout() is not implemented')
  }
  register () {
    throw new Error('AuthInterfaceError: method register() is not implemented')
  }
}

const ErrorUserNotFound = new Error('User not Found')
const ErrorIncorrectPassword = new Error('The password is incorrect')
const ErrorInvalidEmail = new Error('The email format is incorrect')

class AuthService extends AuthInterface {
  constructor (props) {
    super(props)
    this.User = props.User
  }
  async login ({email, password}) {
    const user = await this.User.findOne({ email })
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
  async register ({email, password}) {
    const user = await this.User.findOne({ email })
    if (user) {
      return user
    } else {
      const user = new this.User()
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
