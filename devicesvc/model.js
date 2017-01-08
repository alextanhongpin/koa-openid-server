// model.js
//
// Description: Contains the user model that is used in the authService.
// It's best to carry out model validation here and not in the service
// layer - they are only responsible to throw the errors.

// Dependencies
import mongoose, { Schema } from 'mongoose'
import validator from 'email-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import crypto from 'crypto'
// TODO: Write your implementation of the base 64 encode/decode method
import base64url from 'base64url'
import db from '../common/database.js'
// Constants
const JWT_SECRET = process.env.JWT_SECRET

// Errors are grouped together to make it easier to find and modify
// TODO: Add support for multilingual based on the Content-Language header

// TODO: handle incorrect password scenario for more than 3 times
// Send email to notify that his/her password has been compromised

const DeviceSchema = new Schema({
  access_token: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  user_agent: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  modified_at: {
    type: Date,
    default: Date.now
  }
})

DeviceSchema.methods.createRefreshToken = (size) => {
  // Make it all async!
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

DeviceSchema.methods.createAccessToken = (payload) => {
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
      issuer: process.env.APP_NAME
    }, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

DeviceSchema.methods.validateAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: process.env.APP_NAME
    }, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}
// For testing purposes, it will throw
// MongooseError: Cannot overwrite `User` model once compiled.
let Device
try {
  Device = db.model('Device')
} catch (error) {
  Device = db.model('Device', DeviceSchema)
}
export default Device
