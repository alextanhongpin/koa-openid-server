
const JWT_SECRET = process.env.JWT_SECRET
const APP_NAME = process.env.APP_NAME
import jwt from 'jsonwebtoken'

const sign = (payload) => {
  return new Promise((resolve, reject) => {
    // The access token should have the user_id decoded
    // This will make it easier to use the JWT token as
    // API keys.
    // Optionally, we include the user_agent (Device/Browser)
    // to enable multiple token/analytics on devices logged in.
    jwt.sign({
      user_id: payload.user_id,
      user_agent: payload.user_agent
    }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '2m',
      issuer: APP_NAME
    }, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}
const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: APP_NAME
    }, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

export default { sign, verify }