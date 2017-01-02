// Endpoints

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
    const request = getClientRequest(ctx.params)
    const client = await ctx.service.getClient(request.id)
    const response = getClientResponse(client)
    successResponse(ctx, response, 200)
  } catch (err) {
    throw err
  }
}

// Request/Response handlers
const getClientsRequest = (req) => {
  return req
}

const getClientsResponse = (res) => {
  return res
}

const getClientRequest = (req) => {
  return {
    id: req.id
  }
}

const getClientResponse = (res) => {
  return res
}

const successResponse = (ctx, response, status) => {
  ctx.body = response
  ctx.status = status
}

export default {
  getClients,
  getClient
}
