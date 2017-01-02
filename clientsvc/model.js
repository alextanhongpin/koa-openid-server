// client.js
//
// Description: Clients are registered third-party applications that wants to
// use the core app to login
//
const mongoose = require('mongoose')
const crypto = require('crypto')

const clientSchema = mongoose.Schema({
  client_id: String,
  client_secret: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  modified_at: {
    type: Date,
    default: Date.now
  },
  redirect_uris: [String],
  grant_types: [String],
  client_name: { type: String, required: true },
  logo_uri: String,
  registration_client_uri: String,
  registration_access_token: String
})

clientSchema.methods.generateClientId = function (password) {
  return crypto.randomBytes(16).toString('hex')
}

clientSchema.methods.generateClientSecret = function (password) {
  return crypto.randomBytes(16).toString('hex')
}

clientSchema.pre('save', function (next) {
  this.modified_at = Date.now()
  next()
})

module.exports = mongoose.model('Client', clientSchema)
