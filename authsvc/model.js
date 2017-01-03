import mongoose, { Schema } from 'mongoose'
import validator from 'email-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET

const ErrorEmailRequired = 'Please provide an email address'
const ErrorInvalidEmail = '{VALUE} is not a valid email address'
const ErrorInvalidPassword = 'Password must be at least 6 characters'

// Errors are best handled at the models
// Avoid placing errors elsewhere
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
})

UserSchema.methods.hashPassword = (password) => {
  // It's always better to handle operations asynchronously
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

UserSchema.methods.comparePassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare('bacon', hash, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

UserSchema.methods.createRefreshToken = (payload) => {
  return crypto.randomBytes(16).toString('hex')
}
UserSchema.methods.createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '2m',
      // notBefore:
      // audience
      issuer: 'koa-oauth'
      // jwtid
      // subject
      // noTimestamp
      // header
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
      issuer: 'koa-oauth'
      // audience
      // ignoreExpiration
      // ignoreNotBefore
      // subject
      // clockTolerance
    }, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}
// TODO:
// Add custom email validation mongoose style
// Add password min max length
// Add methods to compare and hash password

export default mongoose.model('User', UserSchema)
