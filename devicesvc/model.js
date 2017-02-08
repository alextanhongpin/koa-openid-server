// model.js
//
// Description: Contains the user model that is used in the authService.
// It's best to carry out model validation here and not in the service
// layer - they are only responsible to throw the errors.

// Dependencies
import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import base64url from 'base64url'
import db from '../common/database.js'
import packageJSON from '../package.json'

// Constants
const JWT_SECRET = process.env.JWT_SECRET
const ISSUER = packageJSON.name

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
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  } 
})

DeviceSchema.statics.createRefreshToken = (size=32) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (error, buffer) => {
      error ? reject(error) : resolve(base64url(buffer))
    })
  })
}

DeviceSchema.statics.createAccessToken = ({ user_id, user_agent, expires_in='2m'}) => {
  return new Promise((resolve, reject) => {
    // The access token should have the user_id decoded
    // This will make it easier to use the JWT token as
    // API keys.
    // Optionally, we include the user_agent (Device/Browser)
    // to enable multiple token/analytics on devices logged in.
    jwt.sign({
      user_id: user_id,
      user_agent: user_agent
    }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: expires_in,
      issuer: ISSUER
    }, (error, token) => {
      error ? reject(error) : resolve(token)
    })
  })
}

DeviceSchema.statics.validateAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: ISSUER
    }, (error, decoded) => {
      error ? reject(error) : resolve(decoded)
    })
  })
}

let Device
try {
  Device = db.model('Device')
} catch (error) {
  Device = db.model('Device', DeviceSchema)
}
export default Device
