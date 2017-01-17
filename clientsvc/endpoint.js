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
    const request = schema.getClientRequest({
      _id: ctx.params.id
    })
    const client = await ctx.service.getClientById(request)

    await ctx.render('client', {
      title: 'Client',
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
const getClientUpdateView = async(ctx, next) => {
  try {
    const request = schema.getClientRequest({
      _id: ctx.params.id
    })
    const client = await ctx.service.getClientById(request)
    const response = schema.getClientResponse(client)

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
    const request = schema.getClientRequest({
      _id: ctx.params.id
    })
    const client = await ctx.service.getClientById(request)
    const response = schema.getClientResponse(client)
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
    // NOTE: the client object returned is not pure JSON, causing
    // error for AJV to parse
    const response = schema.postClientResponse(JSON.parse(JSON.stringify(client)))
    successResponse(ctx, response, 200)
  } catch (err) {
    if (err.name === 'ValidationError') {
      // Handle Mongoose Schema errors
      ctx.status = 400
      ctx.message = err.message
    } else if (err.name === 'Invalid Request') {
      // Handle AJV errors
      ctx.status = 400
      ctx.message = err.description
    } else {
      // Handle other errors
      throw err
    }
  }
}

const updateClient = async (ctx, next) => {
  // Add a permission setting to allow only authorized user to update
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
