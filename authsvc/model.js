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
// Constants
const JWT_SECRET = process.env.JWT_SECRET

// Errors are grouped together to make it easier to find and modify
// TODO: Add support for multilingual based on the Content-Language header
const ErrorEmailRequired = 'Email address must be provided'
const ErrorInvalidEmail = '{VALUE} is not a valid email address'
const ErrorInvalidPassword = 'Password must be at least 6 characters'
const ErrorIncorrectPassword = new Error('Password provided is incorrect')
// TODO: handle incorrect password scenario for more than 3 times
// Send email to notify that his/her password has been compromised

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, ErrorEmailRequired],
    validate: {
      validator (v) {
        return validator.validate(v)
      },
      message: ErrorInvalidEmail
    }
  },
  password: {
    type: String,
    required: true,
    minLength: [6, ErrorInvalidPassword]
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  modified_at: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
  // devices: [ {
  //   access_token: String,
  //   refresh_token: String,
  //   user_agent: String,
  //   created_at: {
  //     type: Date,
  //     default: Date.now
  //   },
  //   modified_at: {
  //     type: Date,
  //     default: Date.now
  //   }
  // } ]
})

UserSchema.methods.hashPassword = (password) => {
  // bcrypt provides a method called .hashSync(),
  // but it's always better to handle operations asynchronously
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, null, null, (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}

// Avoid arrow functions in methods so that the reference
// to `this` is preserved
UserSchema.methods.comparePassword = function (password) {
  // bcrypt provides a method called .compareSync(),
  // but it's always better to handle operations asynchronously
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, isSamePassword) => {
      if (err) {
        reject(err)
      } else {
        console.log('comparepass', err, isSamePassword)
        isSamePassword ? resolve(true) : reject(ErrorIncorrectPassword)
      }
    })
  })
}

UserSchema.methods.createRefreshToken = (size) => {
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

UserSchema.methods.createAccessToken = (payload) => {
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

UserSchema.methods.validateAccessToken = (token) => {
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

export default mongoose.model('User', UserSchema)
