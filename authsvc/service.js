import request from 'request'

// Service should do one thing, and do it well
// Don't mix different logic in one service (orchestration), that
// will be done in the endpoint level
class AuthService {
  constructor ({ db }) {
    this.db = db
  }

  // login allows existing user to access their account
  async login ({email, password}) {
    const user = await this.db.findOne({ email })
    if (!user) throw this.db.errors('USER_NOT_FOUND')

    const isSamePassword = await user.comparePassword(password)
    if (!isSamePassword) this.db.errors('WRONG_PASSWORD')

    return user.toJSON()
  }

  // register allows a user to create a new account
  async register ({email, password}) {
    console.log('authsvc:service:register:params => ', email, password)
    const User = this.db
    const user = await User.findOne({ email })
    console.log('authsvc:service:register:user => ', user)
    if (user) {
      console.log('authsvc:service:register:parsing user to json => ', user.toJSON())
      return user.toJSON()
    } else {
      const user = new User()
      user.email = email
      user.password = await User.hashPassword(password)
      await user.save()
      return user.toJSON()
    }
  }

  // logout allows user to log out of their account
  logout () {
    // TODO: Clears the user's token/device from the database
  }

  // External services are prefixed with `external`
  externalCreateDevice ({ user_id, user_agent }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: 'http://localhost:3100/api/v1/devices',
        headers: {
          // 'Authorization': '',
          'User-Agent': user_agent,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id
        })
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          reject(error)
        }
      })
    })
  }
}

// Export a new auth service
export default (options) => {
  return new AuthService(options)
}
