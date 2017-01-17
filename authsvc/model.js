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
import base64url from 'base64url'

// Database
import db from '../common/database.js'

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
  email_verified: {
    type: Boolean,
    default: false
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
  },
  // // Standard Claims
  sub: {
    type: String
  },
  name: {
    type: String                            
  },
  given_name: {
    type: String
  },
  family_name: {
    type: String
  },
  middle_name: {
    type: String
  },
  nickname: {
    type: String
  },
  preferred_username: {
    type: String
  },
  profile: {
    type: String
  },
  picture: {
    type: String
  },
  website: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female'] 
  },
  birthdate: {
    // Format: ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD
    type: String
  },
  zoneinfo: {
    type: String
  },
  locale: {
    type: String
  },
  phone_number: {
    type: String
  },
  phone_number_verified: {
    type: String
  },
  address: {
    formatted: {
      type: String
    },
    street_address: {
      type: String
    },
    locality: {
      type: String
    },
    region: {
      type: String
    },
    postal_code: {
      type: String
    },
    country: {
      type: String
    }
  }
})

// profile OPTIONAL. This scope value requests access to the End-User's default profile Claims, which are: name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate, zoneinfo, locale, and updated_at.
// email OPTIONAL. This scope value requests access to the email and email_verified Claims.
// address OPTIONAL. This scope value requests access to the address Claim.
// phone OPTIONAL. This scope value requests access to the phone_number and phone_number_verified Claims.
UserSchema.static.hashPassword = (password) => {
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
        isSamePassword ? resolve(true) : reject(ErrorIncorrectPassword)
      }
    })
  })
}

// Statics are pure functions, so arrow function
// is acceptable
UserSchema.statics.createRefreshToken = (size) => {
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

UserSchema.statics.createAccessToken = (payload) => {
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

// Static method to validate the access token
UserSchema.statics.validateAccessToken = (token) => {
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

let User
try {
  User = db.model('User')
} catch (error) {
  User = db.model('User', UserSchema)
}
export default User
