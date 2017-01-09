// http://connect2id.com/products/server/docs/api/authorization

// https://docops.ca.com/ca-api-management-oauth-toolkit/3-6/en/openid-connect-implementation/open-id-connect-implementation-details
// https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce
// https://tools.ietf.org/html/rfc7636

import jwt from '../modules/jwt.js'
class OAuthInteface {
  getAuthorize(params, callback) {
    /*if (!params.name) {
      return callback('Name is required')
    }
    callback(null, response)*/
  }
  postAuthorize () {

  }
  getImplicit() {

  }
  postImplicit () {

  }

  token () {
    //request

// POST /oauth/token HTTP/1.1
// Host: api.mendeley.com
// Authorization: Basic NzczOnh6Y2RvRzh3bVJyZjdOcG0=
// Content-Type: application/x-www-form-urlencoded
// Content-Length: 127

// grant_type=authorization_code&code=zNlyssMxdc88XcKeLdfHvtxmApe&redirect_uri=http:%2F%2Flocalhost%2Fmendeley%2Fserver_sample.php
//     // REsponse
// {
//     "access_token": "MSwxNMWRSemRhbTVVeWYwDA4NDMzY2LDsYWxsLCw0TWtrNEFBNFJoLMSw3NzOTAzZQYWdZeEEEwMzczNDM1",
//     "expires_in": 3600,
//     "refresh_token": "MSwxMDM3MzRU3OUMktdmTsZpCDveWT5XMxQOG1SQTtNzczLVUcHOzNADEsbwGFV",
//     "token_type": "bearer"
// }
  }
  refresh () {
    // request
// POST /oauth/token HTTP/1.1
// Host: api.mendeley.com
// Authorization: Basic NzczOnh6Y2RvRzh3bVJyZjdOcG0=
// Content-Type: application/x-www-form-urlencoded
// Content-Length: 167

// grant_type=refresh_token&refresh_token=MSwxMDM3MzRU3OUMktdmTsZpCDveWT5XMxQOG1SQTtNzczLVUcHOzNADEsbwGFV&redirect_uri=http:%2F%2Flocalhost%2Fmendeley%2Fserver_sample.php

// response
// {
//     "access_token": "MSwxN1zZPUxsLIzDM1wMJWEdDaTZiNNzMsYLDEdzcXNDY4NzaSzDA4Sw3QWCxFYFBZ0ZWzN3NzMZ3MWp5GM",
//     "expires_in": 3600,
//     "refresh_token": "MSwxMDM3MzRU3OUMktdmTsZpCDveWT5XMxQOG1SQTtNzczLVUcHOzNADEsbwGFV",
//     "token_type": "bearer"
// }
  }
}

class OAuthService extends OAuthInteface {
  getAuthorize ({ response_type, scope, client_id, state, redirect_uri}) {
    if (!response_type) throw new Error('')
    if (response_type !== 'code') throw new Error('')
    if (!client_id) throw new Error('')
    if (!redirect_uri) throw new Error('')

    const client = this.db.getClient({ client_id })
    if (!client) {
      // do something
    }
      // "client_name"   : "My Example App",
  // "logo_uri"      : "http://client.example.org/logo.png",
  // "client_uri"    : "http://client.example.org",
  // "policy_uri"    : "http://client.example.org/privacy-policy.html",
  // "tos_uri"       : "http://client.example.org/terms-of-service.html"

  }
  postAuthorize () {
// https://c2id.com/login?
//  response_type=code
//  &scope=openid%20email
//  &client_id=123
//  &state=af0ifjsldkj
//  &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb

    if (!response_type) throw new Error('')
    if (response_type !== 'code') throw new Error('')
    if (!client_id) throw new Error('')
    if (!redirect_uri) throw new Error('')
    const client = this.db.getClient({ client_id })
    if (!client) {
      // do something
    }
    // create a code that can only be used once
    const code = ''

// Response for auth code flow
// https://client.example.org/cb?
 // code=SplxlOBeZQQYbYS6WxSbIA
 // &state=af0ifjsldkj
  }

  getImplicit () {
    // request for get implict
// https://openid.c2id.com?response_type=code
//     &client_id=123
//     &redirect_uri=myapp%3A%2F%2Fopenid-connect-callback
//     &scope=openid
//     &state=-67ztq9L0k6dQiyqEjU-jfPCd40lN-ZsaDQAwLrY1Ro
//     &code_challenge=Oea7ws0BUXkKXADTumdSYj41gQi-VBFYSq_JwqgvX8E
//     &code_challenge_method=S256
//     &request_uri=https%3A%2F%2Fmyapp.io%2Frequest.jwt%2BWhDZ3rM2e76DcqsZOXVwAj2C_l4QzxWhoFPvYHZQkpI

  }

  postImplicit() {
    // request for get implict
// https://openid.c2id.com?response_type=code
//     &client_id=123
//     &redirect_uri=myapp%3A%2F%2Fopenid-connect-callback
//     &scope=openid
//     &state=-67ztq9L0k6dQiyqEjU-jfPCd40lN-ZsaDQAwLrY1Ro
//     &code_challenge=Oea7ws0BUXkKXADTumdSYj41gQi-VBFYSq_JwqgvX8E
//     &code_challenge_method=S256
//     &request_uri=https%3A%2F%2Fmyapp.io%2Frequest.jwt%2BWhDZ3rM2e76DcqsZOXVwAj2C_l4QzxWhoFPvYHZQkpI

 // repsonse  for implicit flow
 // https://client.example.org/cb#
 // access_token=SlAV32hkKG
 // &token_type=bearer
 // &expires_in=3600
 // &id_token=eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso
 // &state=af0ifjsldkj
  }

  postIntrospect ({ token, token_type_hint }) {
    // http://connect2id.com/products/server/docs/api/token-introspection
    if (!token) {
      throw new Error('Invalid request: Token is required')
    }
    if (!token_type_hint) {
      throw new Error('Invalid request. token_type_hint is missing from request body')
    }

    if (token_type_hint !== 'access_token') {
      throw new Error('Invalid request: Token type is not supported')
    }
    return jwt.verify(token)
    // await jwt.verify().then(() => {})
    // if (ErrorTokenExpired) { return active : false}
// request
// POST /clients HTTP/1.1
// Host: c2id.com
// Authorization: Bearer ztucZS1ZyFKgh0tUEruUtiSTXhnexmd6
// Content-Type: application/json

// { 
//   "grant_types" : [ "client_credentials" ], 
//   "scope"       : "https://c2id.com/token/introspect"
// }

// response


/// For invalid token
// HTTP/1.1 200 OK
// Content-Type: application/json;charset=UTF-8

// {
//   "active" : false
// }


// HTTP/1.1 400 Bad Request

// {
//   "error"             : "invalid_request",
//   "error_description" : "Invalid request: Missing required token parameter"
// }
// HTTP/1.1 401 Unauthorized

// {
//   "error"             : "invalid_client",
//   "error_description" : "Client authentication failed: Missing client authentication / token"
// }
// HTTP/1.1 403 Forbidden

// {
//   "error"             : "access_denied",
//   "error_description" : "Client not registered for https://c2id.com/token/introspect scope"
// }
  }
  postToken () {
    // 
  }
  // .well-known/openid-configuration
  configuration () {
// HTTP/1.1 200 OK
// Content-Type: application/json

// {
//   "issuer"                                : "https://c2id.com",
//   "token_endpoint"                        : "https://c2id.com/token",
//   "introspection_endpoint"                : "https://c2id.com/token/introspect",
//   "revocation_endpoint"                   : "https://c2id.com/token/revoke",
//   "authorization_endpoint"                : "https://c2id.com/login",
//   "userinfo_endpoint"                     : "https://c2id.com/userinfo",
//   "registration_endpoint"                 : "https://demo.c2id.com/c2id/client-reg",
//   "jwks_uri"                              : "https://demo.c2id.com/c2id/jwks.json",
//   "scopes_supported"                      : [ "openid",
//                                               "profile",
//                                               "email",
//                                               "address",
//                                               "phone",
//                                               "offline_access" ],
//   "response_types_supported"              : [ "code",
//                                               "id_token",
//                                               "token id_token",
//                                               "code id_token" ,
//                                               "code token id_token" ],
//   "response_modes_supported"              : [ "query",
//                                               "fragment",
//                                                "form_post" ],
//   "grant_types_supported"                 : [ "implicit",
//                                               "authorization_code",
//                                               "refresh_token",
//                                               "password",
//                                               "client_credentials",
//                                               "urn:ietf:params:oauth:grant-type:jwt-bearer",      
//                                               "urn:ietf:params:oauth:grant-type:saml2-bearer" ],      
//   "code_challenge_methods_supported"      : [ "S256",
//                                               "plain" ],
//   "acr_values_supported"                  : [ "urn:c2id:acr:bronze",
//                                               "urn:c2id:acr:silver"
//                                               "urn:c2id:acr:gold" ],
//   "subject_types_supported"               : [ "public" ],                                
//   "token_endpoint_auth_methods_supported" : [ "client_secret_basic",
//                                               "client_secret_post",
//                                               "client_secret_jwt",
//                                               "private_key_jwt" ],                                 
//   "token_endpoint_auth_signing_alg_values_supported" : 
//                                             [ "HS256",
//                                               "HS512",
//                                               "HS384",
//                                               "RS256",
//                                               "RS384",
//                                               "RS512",
//                                               "PS256",
//                                               "PS384",
//                                               "PS512",
//                                               "ES256",
//                                               "ES384",
//                                               "ES512" ],                                 
//   "id_token_signing_alg_values_supported" : [ "RS256",
//                                               "RS384",
//                                               "RS512",
//                                               "PS256",
//                                               "PS384",
//                                               "PS512",
//                                               "HS256",
//                                               "HS384",
//                                               "HS512" ],
//   "userinfo_signing_alg_values_supported" : [ "RS256",
//                                               "RS384",
//                                               "RS512",
//                                               "PS256",
//                                               "PS384",
//                                               "PS512",
//                                               "HS256",
//                                               "HS384",
//                                               "HS512" ],   
//   "display_values_supported"              : [ "page", 
//                                               "popup" ],   
//   "claim_types_supported"                 : [ "normal" ],   
//   "claims_supported"                      : [ "sub",
//                                               "iss",
//                                               "auth_time",
//                                               "acr",
//                                               "name",
//                                               "given_name",
//                                               "family_name",
//                                               "nickname",
//                                               "email",
//                                               "email_verified" ],
//   "ui_locales_supported"                  : [ "en" ],   
//   "claims_parameter_supported"            : true,   
//   "request_parameter_supported"           : false,
//   "request_uri_parameter_supported"       : false,
//   "require_request_uri_registration"      : false
// }
  }
}
// GET /login

// Authorisation Code Grant
// Implicit Grant



// response_type: code for oauthcode flow
// response_type: token id_token for implicit flow
// scope: openid mandatory
// [ nonce ] Opaque value, e.g. a random string, used to associate a client session with an ID Token, and to mitigate replay attacks. Use of this parameter is required in the implicit flow.

// [ code_challenge ] The code challenge, computed from the code verifier using a transform.
// [ code_challenge_method ] The code transform, defaults to plain if not specified. The supported methods are S256 (recommended) and plain.

// Export a new auth service
export default (options) => {
  return new OAuthService(options)
}
