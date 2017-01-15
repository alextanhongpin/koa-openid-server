// code.js
// Description: Authorization Code Generator

import crypto from 'crypto'
// TODO: Write your implementation of the base 64 encode/decode method
import base64url from 'base64url'

const generateCode = (size) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buffer) => {
      if (err) {
        reject(err)
      } else {
        // .toString('hex')
        resolve(base64url(buffer))
      }
    })
  })
}

export default generateCode