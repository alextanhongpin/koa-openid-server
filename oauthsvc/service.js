// http://connect2id.com/products/server/docs/api/authorization

// https://docops.ca.com/ca-api-management-oauth-toolkit/3-6/en/openid-connect-implementation/open-id-connect-implementation-details
// https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce
// https://tools.ietf.org/html/rfc7636

import jwt from '../modules/jwt.js'

class OAuthInteface {
  authorize() {
    throw new Error('OAuthInterfaceError: authorize() is not implemented')
  }
  token () {
    throw new Error('OAuthInterfaceError: token() is not implemented')
  }
  refresh () {
    throw new Error('OAuthInterfaceError: refresh() is not implemented')
  }
}

class OAuthService extends OAuthInteface {
  constructor(props) {
    super(props)
    this.db = props.db
  }
  getAuthorize ({ response_type, scope, client_id, state, redirect_uri }) {
    return this.db.getClient({ client_id }).then((client) => {
      if (!client) {
        // Client does not exist error
      } else {
        if (client.redirect_uri !== redirect_uri) {
          // throw error
        }
        if (client.scope !== scope) {
          // throw error
        }
        return {
          client_name: 'my example app',
          logo_uri: 'http://client.example.org/logo.png',
          client_uri: 'http://client.example.org',
          policy_uri: 'http://client.example.org/privacy-policy.html',
          tos_uri: 'http://client.example.org/terms-of-service.html'
        }
      }
    })
  }
  postAuthorize ({ response_type, scope, client_id, state, redirect_uri }) {
    return this.db.getClient({ client_id }).then((client) => {
      if (!client) {
        // Client does not exist error
      } else {
        if (client.redirect_uri !== redirect_uri) {
          // throw error
        }
        if (client.scope !== scope) {
          // throw error
        }
        return {
          code: 'new code',
          state
        }
      }
    })
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

  introspect ({ token, token_type_hint }) {
    // http://connect2id.com/products/server/docs/api/token-introspection
    return jwt.verify(token)
    .catch((err) => {
      if (err) {
        // Create a new error with description
        const error = new Error(err.name)
        error.description = err.message
        error.status = 400
        throw error
      }
    })


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
  token () {
    // 
  }
  refresh ({ refresh_token, user_id, user_agent }) {
    return jwt.sign({
      user_id, user_agent
    }).then((access_token) => {
      return {
        access_token,
        expires_in: 3600, // Update it later
        token_type: 'bearer',
        refresh_token
      }
    })
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
