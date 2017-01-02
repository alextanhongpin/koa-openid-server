// Create an interface

// The authentication interface
class AuthInterface {
  login () {
    throw new Error('AuthInterfaceError: login is not implemented')
  }
  register () {
    throw new Error('AuthInterfaceError: login is not implemented')
  }
}

const ErrorUserNotFound = new Error('User not Found')
const ErrorIncorrectPassword = new Error('The password is incorrect')
const ErrorInvalidEmail = new Error('The email format is incorrect')

class AuthService extends AuthInterface {
  constructor (props) {
    super(props)
    this.db = props.db
  }
  login (email, password) {
    return this.db.findOne({ email }).then((user) => {
      if (!user) {
        throw ErrorUserNotFound
      } else if (user.password !== password) {
        throw ErrorIncorrectPassword
      } else {
        return user
      }
    })
  }
  register (email, password) {
    const User = this.db
    return this.db.findOne({ email }).then((user) => {
      console.log('regidter user')
      if (user) {
        return user
      } else {
        const user = new User()
        user.email = email
        user.password = password
        return user.save()
      }
    })
  }
  getUsers () {
    return this.db.find()
  }
}

// Export a new auth service
export default (options) => {
  return new AuthService(options)
}
