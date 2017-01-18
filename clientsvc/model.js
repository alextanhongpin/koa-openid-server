// client.js
//
// Description: Clients are registered third-party applications that wants to
// use the core app to login
//
// Reference
// http://connect2id.com/blog/oauth-openid-connect-client-registration-explained
// https://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-17
//
import { Schema } from 'mongoose'
import crypto from 'crypto'
import base64url from 'base64url'
import db from '../common/database.js'

const ClientSchema = Schema({
  // user_id;  who the account is tied to
  client_id: {
    type: String,
    required: true
  },
  client_secret: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  modified_at: {
    type: Date,
    default: Date.now
  },
  redirect_uris: [{
    type: String
    // required: true
  }],
  client_name: {
    type: String,
    required: true
  },
  client_uri: {
    type: String
  },
  logo_uri: String,
  scope: [{
    type: String
  }],
  contacts: [{ type: String }],
  tos_uri: String,
  policy_uri: String,
  jwks_uri: String,
  registration_client_uri: String,
  registration_access_token: String,
  token_endpoint_auth_method: {
    type: String,
    enum: [
      'none', 
      'client_secret_post', 
      'client_secret_basic' 
    ]
  },
  grant_types: [{
    type: String,
    enum: [
      'authorization_code',
      'implicit',
      'password',
      'refresh_token',
      'urn:ietf:prams:oauth:grant-type:jwt-bearer',
      'urn:ietf:params:outh:grant-type:saml2-bearer'
    ]
  }],
  responses_types: [{
    type: String,
    enum: [
      'code', // The authorization code response,
      'token' // The implicit response
    ]
  }]
})


ClientSchema.statics.generateClientId = function (size = 32) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size || 32, (err, buffer) => {
      if (err) {
        reject(err)
      } else {
        // .toString('hex')
        resolve(base64url(buffer))
      }
    })
  })
}

ClientSchema.statics.generateClientSecret = function (size = 32) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size || 32, (err, buffer) => {
      if (err) {
        reject(err)
      } else {
        // .toString('hex')
        resolve(base64url(buffer))
      }
    })
  })
}

// clientSchema.pre('save', function (next) {
//   this.modified_at = Date.now()
//   next()
// })

let Client
try {
  Client = db.model('Client')
} catch (error) {
  Client = db.model('Client', ClientSchema)
}
export default Client
