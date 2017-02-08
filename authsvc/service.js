// authsvc/service.js

const ErrorUserNotFound = new Error('User not Found')
const ErrorIncorrectPassword = new Error('The password is incorrect')
const ErrorInvalidEmail = new Error('The email format is incorrect')

class AuthService  {
  constructor (props) {
    this.db = props.db
  }
  async login ({email, password}) {
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
  async register ({email, password}) {
    const user = await this.db.findOne({ email })
    if (user) {
      return user
    } else {
      const user = new this.db()
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
