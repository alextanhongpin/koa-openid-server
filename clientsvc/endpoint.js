// Endpoints
import schema from './schema.js'

// GET /register/clients
const postClientView = async(ctx, next) => {
  await ctx.render('client-register', {
    title: 'Client Registration'
  })
}

// GET /clients
const getClientsView = async (ctx, next) => {
  try {
    const request = getClientsRequest(ctx.query)
    const clients = await ctx.service.getClients(request)
    const response = getClientsResponse(clients)
    console.log(clients)
    await ctx.render('clients', {
      title: 'Client',
      clients,
      error: null
    })
  } catch (err) {
    await ctx.render('clients', {
      title: 'Clients',
      error: 'The client does not exist or have been deleted'
    })
  }
}

// GET /clients/:id
const getClientView = async(ctx, next) => {
  try {
    const request = getClientRequest(ctx)
    const client = await ctx.service.getClientById(request)
    console.log(client)

    await ctx.render('client', {
      title: 'Client',
      client,
      error: null
    })
  } catch (err) {
    console.log(err)
    await ctx.render('client', {
      title: 'Client',
      error: 'The client does not exist or have been deleted'
    })
  }
}
const getClientUpdateView = async(ctx, next) => {
  try {
    const request = getClientRequest(ctx)
    const client = await ctx.service.getClientById(request)
    const response = getClientResponse(client)

    await ctx.render('client-edit', {
      title: 'Client Edit',
      client,
      error: null
    })
  } catch (err) {
    await ctx.render('client', {
      title: 'Client',
      error: 'The client does not exist or have been deleted'
    })
  }
}
// GET /clients
// Description: Returns a list of clients
const getClients = async(ctx, next) => {
  // NOTE:
  // try-catch is redundant here since the global error
  // handler will capture the error
  // only use try-catch if you want to throw custom response
  // errors (like redirection)
  // try {
  const request = getClientsRequest(ctx.query)
  const clients = await ctx.service.getClients(request)
  const response = getClientsResponse(clients)
  successResponse(ctx, response, 200)
  // } catch (err) {
    // Throw the error so that it can be captured
    // throw err
  // }
}

// GET /clients/:id
// Description: Return a client by id
const getClient = async(ctx, next) => {
  try {
    const request = getClientRequest(ctx)
    const client = await ctx.service.getClientById(request)
    const response = getClientResponse(client)
    // this.set('Cache-Control', 'no-cache')
    // this.set('Pragma', 'no-cache')
    successResponse(ctx, response, 200)
  } catch (err) {
    throw err
  }
}
// POST /clients
// Description: Create a new client
const postClient = async(ctx, next) => {
  try {
    const request = schema.postClientRequest({
      contacts: ctx.request.body.contacts,
      client_name: ctx.request.body.clientName,
      client_uri: ctx.request.body.clientURI,
      logo_uri: ctx.request.body.logoURI,
      tos_uri: ctx.request.body.tosURI,
      policy_uri: ctx.request.body.policyURI,
      redirect_uris: ctx.request.body.redirectURIs
    })
    const client = await ctx.service.postClient(request)
    const response = schema.postClientResponse(client)
    successResponse(ctx, response, 200)
  } catch (err) {
    if (err.name === 'ValidationError') {
      ctx.status = 400
      ctx.message = err.message
    } else {
      // Handle other errors
      throw err
    }
  }
}

const updateClient = async (ctx, next) => {
  // Add a permission setting to allow only authorized user to update
  console.log(ctx.params)
  try {
    const request = schema.updateClientRequest({
      contacts: ctx.request.body.contacts,
      client_name: ctx.request.body.clientName,
      client_uri: ctx.request.body.clientURI,
      logo_uri: ctx.request.body.logoURI,
      tos_uri: ctx.request.body.tosURI,
      policy_uri: ctx.request.body.policyURI,
      redirect_uris: ctx.request.body.redirectURIs
    })

    const client = await ctx.service.updateClient(ctx.params.id, request)
    successResponse(ctx, client, 200)
  } catch (err) {
    if (err.name === 'ValidationError') {
      ctx.status = 400
      ctx.message = err.message
    } else {
      // Handle other errors
      throw err
    }
  }
}

// Request/Response handlers
const getClientsRequest = (req) => {
  return req
}

const getClientsResponse = (res) => {
  return res
}

const getClientRequest = (ctx) => {
  return {
    _id: ctx.params.id
  }
}

const getClientResponse = (res) => {
  return {
    logo_uri: res.logo_uri,
    client_uri: res.client_uri,
    client_name: res.client_name,
    client_secret: res.client_secret,
    client_id: res.client_id,
    responses_types: res.responses_types,
    grant_types: res.grant_types,
    contacts: res.contacts,
    redirect_uris: res.redirect_uris
  }
}

// @ctx is the koa's ctx
const postClientRequest = (ctx) => {
  // Write a handler that only allows strict parameters
  const allowedParameters = ['clientName', 'clientURI', 'logoURI', 'tosURI', 'policyURI', 'redirectURIs']
  return {
    // client_id: ctx.request.body.clientId,
    // client_secret: ctx.request.body.clientSecret,
    client_name: ctx.request.body.clientName,
    client_uri: ctx.request.body.clientURI,
    logo_uri: ctx.request.body.logoURI,
    tos_uri: ctx.request.body.tosURI,
    policy_uri: ctx.request.body.policyURI,
    redirect_uris: ctx.request.body.redirectURIs
  }
}
const postClientResponse = res => {
  return {
    client_id: res.client_id,
    client_secret: res.client_secret,
    client_id_issued_at: res.created_at,
    client_secret_expires_at: 0,
    redirect_uris: res.redirect_uris,
    grant_types: res.grant_types,
    client_name: res.client_name,
    token_endpoint_auth_method: 'client_secret_basic',
    logo_uri: res.logo_uri,
    responses_types: res.responses_types
    // jwks_uri
    // example_extension_paramenter
  }
}
// POST Display to end users
//
  // "redirect_uris" : [ "https://client.example.org/callback" ],
  // "client_name"   : "My Example App",
  // "logo_uri"      : "http://client.example.org/logo.png",
  // "client_uri"    : "http://client.example.org",
  // "policy_uri"    : "http://client.example.org/privacy-policy.html",
  // "tos_uri"       : "http://client.example.org/terms-of-service.html"

// {
//   "client_id"                    : "ug2sb5zkcmpsi",
//   "client_id_issued_at"          : 1412692755,
//   "client_secret"                : "DUdXNieQ8fwF07surrra8htYc5f_yED0MxuM21yw7W8",
//   "client_secret_expires_at"     : 0,
//   "registration_client_uri"      : "https://demo.c2id.com/c2id/clients/ug2sb5zkcmpsi",
//   "registration_access_token"    : "5YHead_Ir8rNQP2KYW31XZHvca7Xk0qi6HKoS-OoTZg",
//   "grant_types"                  : [ "authorization_code" ],
//   "response_types"               : [ "code" ],
//   "redirect_uris"                : [ "https://client.example.org/callback" ],
//   "token_endpoint_auth_method"   : "client_secret_basic",
//   "client_name"                  : "My Example App",
//   "logo_uri"                     : "http://client.example.org/logo.png",
//   "client_uri"                   : "http://client.example.org",
//   "policy_uri"                   : "http://client.example.org/privacy-policy.html",
//   "tos_uri"                      : "http://client.example.org/terms-of-service.html",
//   "application_type"             : "web",
//   "subject_type"                 : "public",
//   "id_token_signed_response_alg" : "RS256",
//   "require_auth_time"            : false
// }

// Example registration request for a public native client (mobile app using the code flow and a custom redirection URI):

// POST /c2id/clients HTTP/1.1
// Host: demo.c2id.com
// Content-Type: application/json

// {
//   "application_type"           : "native",
//   "redirect_uris"              : [ "com.example.app:///auth" ],
//   "token_endpoint_auth_method" : "none"
// }

// POST /c2id/clients HTTP/1.1
// Host: demo.c2id.com
// Content-Type: application/json

// {
//   "grant_types"                : [ "implicit" ],
//   "response_types"             : [ "token id_token", "id_token" ],
//   "redirect_uris"              : [ "https://myapp.example.com/?callback" ],
//   "token_endpoint_auth_method" : "none"
// }

// 4.8 How to register a client for JWT authentication
// {
//   "iss" : "oe7aiz60",
//   "sub" : "oe7aiz60",
//   "aud" : "https://demo.c2id.com/c2id/token",
//   "exp" : 1453021544
// }

const successResponse = (ctx, response, status) => {
  ctx.body = response
  ctx.status = status
}

export default {
  postClientView,
  getClientsView,
  getClientView,
  getClientUpdateView,

  getClients,
  getClient,
  postClient,
  updateClient
}
