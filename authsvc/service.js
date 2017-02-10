
const ErrorUserNotFound = new Error('User not Found')
const ErrorIncorrectPassword = new Error('The password is incorrect')
const ErrorInvalidEmail = new Error('The email format is incorrect')


// Service should do one thing, and do it well
// Don't mix different logic in one service (orchestration), that 
// will be done in the endpoint level
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
        return user.toJSON()
      }
    }
  }
  async register ({email, password}) {

    const User = this.db
    const user = await User.findOne({ email })
    if (user) {
      return user.toJSON()
    } else {
      const user = new User()
      user.email = email
      user.password = await User.hashPassword(password)
      await user.save()
      return user.toJSON()
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
