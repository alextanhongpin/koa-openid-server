

import jwt from '../modules/jwt.js'
import Code from '../modules/code.js'

// TODO: change oauth to openidconnect
class OAuthService {
  constructor (props) {
    // Not a good idea to integrated different data store here...
    this.redis = props.redis
  }
  // getAuthorize ({ response_type, scope, client_id, state, redirect_uri }) {
  //   return this.db.findOne({ client_id }).then((client) => {
  //     if (!client) {
  //       // Client does not exist error
  //       const errorClientDoNotExist = new Error('Forbidden')
  //       errorClientDoNotExist.description = 'The client is not found or have been deleted'
  //       errorClientDoNotExist.redirect_uri = redirect_uri
  //       throw errorClientDoNotExist
  //     } else {
  //       const uriSet = new Set(client.redirect_uris)
  //       if (!uriSet.has(redirect_uri)) {
  //         const errorInvalidRedirectURI = new Error('Invalid Request')
  //         errorInvalidRedirectURI.description = 'The redirect uri provided does not match the client redirect uri'
  //         errorInvalidRedirectURI.redirect_uri = redirect_uri
  //         throw errorInvalidRedirectURI
  //       }
  //       if (client.scope !== scope) {

  //       }
  //       return client
  //     }
  //   })
  // }
  // postAuthorize ({ response_type, scope, client_id, state, redirect_uri }) {
  //   return this.db.findOne({ client_id }).then((client) => {
  //     if (!client) {
  //       // Client does not exist error
  //       const errorClientDoNotExist = new Error('Forbidden')
  //       errorClientDoNotExist.description = 'The client is not found or have been deleted'
  //       errorClientDoNotExist.redirect_uri = redirect_uri
  //       throw errorClientDoNotExist
  //     } else {
  //       const uriSet = new Set(client.redirect_uris)
  //       if (!uriSet.has(redirect_uri)) {
  //         const errorInvalidRedirectURI = new Error('Invalid Request')
  //         errorInvalidRedirectURI.description = 'The redirect uri provided does not match the client redirect uri'
  //         errorInvalidRedirectURI.redirect_uri = redirect_uri
  //         throw errorInvalidRedirectURI
  //       }

  //       if (client.scope !== scope) {
  //         // throw error
  //       }
  //       // Generate a new code
  //       return Code(32).then((code) => {
  //         return {
  //           code,
  //           state
  //         }
  //       })
  //     }
  //   })
  // }

  authorization ({ state }) {
    return Code(32).then((code) => {
      return {
        code,
        state
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

  postImplicit () {
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

    return jwt.verify(token)
    .catch((err) => {
      if (err) {
        // Create a new error with description
        const error = new Error(err.name)
        error.description = err.message
        error.status = 400
        throw error
      }
    }).then((token) => {
      // iat
      // exp
      // iss (compare the iss to see if it's the same)
      return {
        active: true,
        expires_in: token.exp - Date.now() / 1000
      }
    })
  }
  token ({ code, grant_type }) {
    const redis = this.redis
    const key = `authcode:user:${code}`
    return new Promise((resolve, reject) => {
      redis.get(key, function (err, value) {
        if (err) {
          reject(err)
        } else {
          if (value) {
            const createAccessToken = jwt.sign({
              user_id: value.user_id
            })
            const createRefreshToken = Code(32)
            Promise.all([createAccessToken, createRefreshToken]).then((data) => {
              redis.del(key)
              resolve({
                access_token: data[0],
                refresh_token: data[1],
                expires_in: 120,
                token_type: 'bearer'
              })
            })
          } else {
            reject(new Error('the code has expired'))
          }
        }
      })
    })
  }
  async refresh ({ user_id, user_agent }) {
    return jwt.sign({
      user_id, user_agent
    })
  }
  // GET /.well-known/openid-configuration
  async configuration () {
    // Do something
  }
}

// Export a new auth service
export default (options) => {
  return new OAuthService(options)
}
