// Endpoints
// Create an empty schema that allows everything to pass through
class Endpoint {
  async postClientView (ctx, next) {
    await ctx.render('client-register', {
      title: 'Client Registration'
    })
  }

  // GET /clients
  async getClientsView (ctx, next)  {
    try {
      const request = {}
      const clients = await ctx.service.getClients(request)
      const response = clients

      await ctx.render('clients', {
        title: 'Client',
        clients: response,
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
  async getClientView (ctx, next) {
    try {
      const request = {
        _id: ctx.params.id
      }
      const client = await ctx.service.getClientById(request)
      const response = client

      await ctx.render('client', {
        title: 'Client',
        client: response,
        error: null
      })
    } catch (err) {
      await ctx.render('client', {
        title: 'Client',
        error: 'The client does not exist or have been deleted'
      })
    }
  }
  async getClientUpdateView (ctx, next) {
    try {
      const request = {
        _id: ctx.params.id
      }
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
  async getClients (ctx, next) {
    // NOTE:
    // try-catch is redundant here since the global error
    // handler will capture the error
    // only use try-catch if you want to throw custom response
    // errors (like redirection)
    // try {
    const request = getClientsRequest(ctx.query)
    const clients = await ctx.service.getClients(request)
    const response = getClientsResponse(clients)
    ctx.status = 200
    ctx.body = response
  }

  // GET /clients/:id
  // Description: Return a client by id
  async getClient (ctx, next) {

    const request = schema.getClientRequest({
      _id: ctx.params.id
    })
    const client = await ctx.service.getClientById(request)
    const response = client
    // this.set('Cache-Control', 'no-cache')
    // this.set('Pragma', 'no-cache')
    ctx.status = 200
    ctx.body = response

  }
  // POST /clients
  // Description: Create a new client
  async postClient (ctx, next) {
    try {
      const request =  ctx.schema.postClientRequest({
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
      const response = ctx.schema.postClientResponse(JSON.parse(JSON.stringify(client)))
      

      ctx.status = 200
      ctx.body = response
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

  async updateClient (ctx, next) {
    // Add a permission setting to allow only authorized user to update
    try {
      const request = ctx.schema.updateClientRequest({
        contacts: ctx.request.body.contacts,
        client_name: ctx.request.body.clientName,
        client_uri: ctx.request.body.clientURI,
        logo_uri: ctx.request.body.logoURI,
        tos_uri: ctx.request.body.tosURI,
        policy_uri: ctx.request.body.policyURI,
        redirect_uris: ctx.request.body.redirectURIs
      })

      const client = await ctx.service.updateClient(ctx.params.id, request)
      const response = client
      
      ctx.status = 200
      ctx.body = client
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
}
export default () => {
  return new Endpoint()
}
