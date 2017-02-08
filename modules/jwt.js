
import packageJSON from '../package.json'

const JWT_SECRET = process.env.JWT_SECRET
const ISSUER = packageJSON.name

import jwt from 'jsonwebtoken'


class JWT {
  constructor ({ secret, algorithm, issuer }) {
    this.secret = secret
    this.algorithm = algorithm
    this.issuer = issuer 
  }
  sign ({ user_id, user_agent, expires_in='2m' }) {
    return new Promise((resolve, reject) => {
      jwt.sign({ user_id, user_agent }, this.secret, {
        algorithm: this.algorithm,
        expiresIn: expires_in,
        issuer: this.issuer
      }, (error, token) => {
        error ? reject(error) : resolve(token)
      })
    })
  }
  verify ({ token }) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, {
        algorithms: [this.algorithm],
        issuer: this.issuer
      }, (error, decoded) => {
        error ? reject(error) : resolve(decoded)
      })
    })
  }
}

export default () => {
  return new JWT({
    secret: JWT_SECRET,
    algorithm: 'HS256',
    issuer: ISSUER
  })
}