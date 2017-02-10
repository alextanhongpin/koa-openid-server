
import request from 'request'
import circuitBreaker from 'opossum'

class ExternalService {
  constructor() {
    this.state = {
      options: {
        timeout: 10000,
        maxFailures: 5,
        resetTimeout: 30000
      }
    }
  }
  createDevice() {
    return circuitBreaker(({ user_id, user_agent }) {
      return new Promise((resolve, reject) => {
        request({
          method: 'POST',
          url: 'http://localhost:3100/api/v1/devices',
          headers: {
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
    }, this.state.options).fire()
  }
}

export default () => {
  return new ExternalService()
}
