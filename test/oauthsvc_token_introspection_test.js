// import 'babel-polyfill'
// import app from '../server.js'
// import chai from 'chai'
// import chaiHTTP from 'chai-http'
// import OAuth from '../oauthsvc/model.js'

// chai.use(chaiHTTP)
// const should = chai.should()

// const server = () => {
//   return chai.request(app.listen())
// }

// // describe('Token Introspection', () => {
// //   beforeEach((done) => {
// //     OAuth.remove({}).then(() => done())
// //   })

// //   context('Given that the client request with the method GET', () =>{
// //     it ('shall return unallowed methods')
// //   })

// //   context('Given that the client submitted additional body', () => {
// //     it ('shall not accept the request')
// //   })
// //   context('Given that the client request a token using basic authentication', () =>{
// //     it('shall have the correct content type', (done) => {
// //       // contentType =application/x-www-form-urlencoded
// //       done()
// //     })
// //     it ('shall have Basic in the header')
// //     it ('shall have token in the request body')
// //     // throw error
// //     it ('shall respond with success')
// //   })

// //   context('Given that the client request a token using client secret JWT authentication', () =>{
// //     it('shall have the correct content type', (done) => {
// //       // contentType =application/x-www-form-urlencoded
// //       done()
// //     })
// //     it ('shall have token in the request body')
// //     it ('shall have client_assertion_type in the request body')
// //     it ('shall have client_assertion in the request body')
// //   })

// //   context('Given that the client request a token using bearer token authorization', () => {
// //     it ('shall have the correct header type')
// //     it ('shall have Bearer in request header')
// //     it ('shall have token in request body')
// //   })

// //   context('Given that the token is valid', () => {
// //     it ('shall respond with status 200')
// //     it ('shall have the correct fields in the response')
// //     it ('shall have active true')
// //     it ('shall have content type application json')
// // // Content-Type: application/json
// // // Cache-Control: no-store
// // // Pragma: no-cache
// //   })
// //   context('Given that the token is invalid', () => {
// //     it ('shall respond with status 200')
// //     it ('shall have active false')
// //   })

// //   context('Given that one or more request is not provided', () => {
// //     it ('shall respond with status 400 Bad Request')
// //     it ('shall have property error')
// //     it ('shall have property error description')
// // //   HTTP/1.1 400 Bad Request

// // // {
// // //   "error"             : "invalid_request",
// // //   "error_description" : "Invalid request: Missing required token parameter"
// // // }
// //   })

// //   context('Given that the client does not exist', () => {
// //     it ('shall respond with status 401 Unauthorized')
// //     it ('shall have property error')
// //     it ('shall have property error description')
// // //     {
// // //   "error"             : "invalid_client",
// // //   "error_description" : "Client authentication failed: Missing client authentication / token"
// // // }
// //   })

// //   context('Given that one or more scope is not provided', () => {
// //     it ('shall respond with status 403 Forbidden')
// // // {
// // //   "error"             : "access_denied",
// // //   "error_description" : "Client not registered for https://c2id.com/token/introspect scope"
// // // }
// //   })
// // })
