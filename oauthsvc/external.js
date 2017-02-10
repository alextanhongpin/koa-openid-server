
import request from 'request'
import circuitBreaker from 'opossum'

// TODO:
// 1. Automatic Service Discovery
// 2. Authorization
// 3. API Gateway

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
  getOneClient({ client_id }) {
    return circuitBreaker(({ user_id, user_agent }) {
      return new Promise((resolve, reject) => {
        request({
          method: 'GET',
          url: `http://localhost:3100/api/v1/clients/${client_id}`,
          headers: {
            // TODO: Include authorization
            // 'Authorization': '',
            'Content-Type': 'application/json'
          }
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
