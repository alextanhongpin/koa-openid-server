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
    // required: true
  },
  logo_uri: String,
  scope: [{
    type: String
  }],
  contacts: [{ type: String }], // email addresses
  tos_uri: String,
  policy_uri: String,
  jwks_uri: String,
  // jwks
  // software_id
  // software_version
  registration_client_uri: String,
  registration_access_token: String,
  token_endpoint_auth_method: {
    type: String,
    enum: [
      'none', // The client is a public client as defined in oauth2 and does not have a client secret
      'client_secret_post', // The client uses the HTTP Post parameters defined in oauth2.0
      'client_secret_basic' // The client uses the HTTP basic defined in oauth2.0
    ]
  },
  grant_types: [{
    type: String,
    enum: [
      'authorization_code', // The authorization code grant as described in oauth2.0
      'implicit', // The implicit grant as described in oauth2.0
      'password', // The resource owner password credentials grant described in oauth2.0
      'refresh_token', // the refresh token grant described in oauth2.0
      'urn:ietf:prams:oauth:grant-type:jwt-bearer', // The JWT Bearer grant described in Oauth JWT Bearer Token Profiles
      'urn:ietf:params:outh:grant-type:saml2-bearer' // The SAML 2 Bearer Grant described in Oauth saml 2 bearer token profiles
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

// Errors
// error: Single ASCII error code string
// error_description

   // invalid_redirect_uri
   //    The value of one or more redirection URIs is invalid.

   // invalid_client_metadata
   //    The value of one of the client metadata fields is invalid and the
   //    server has rejected this request.  Note that an Authorization
   //    server MAY choose to substitute a valid value for any requested
   //    parameter of a client's metadata.

   // invalid_software_statement
   //    The software statement presented is invalid.

   // unapproved_software_statement
   //    The software statement presented is not approved for use by this
   //    authorization server.
    // {
    //   "error": "invalid_redirect_uri",
    //   "error_description": "The redirect URI http://sketchy.example.com
    //     is not allowed by this server."
    //  }
     // {
     //  "error": "invalid_client_metadata",
     //  "error_description": "The grant type 'authorization_code' must be
     //    registered along with the response type 'code' but found only
     //   'implicit' instead."
     // }

ClientSchema.statics.generateClientId = function (size) {
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

ClientSchema.statics.generateClientSecret = function (size) {
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
