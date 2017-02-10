
import request from 'request'

class ExternalService {
  createDevice ({ user_id, user_agent }) {
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
      }, (error, httpResponse, body) => {
        if (!error && httpResponse.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          reject(error)
        }
      })
    })
  }
}

export default () => {
  return new ExternalService()
}
