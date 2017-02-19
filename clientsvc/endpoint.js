// Endpoints
// Create an empty schema that allows everything to pass through

class Endpoint {
  // GET /clients
  // Description: Returns a view displaying all clients
  async allView (ctx, next) {
    try {
      const request = ctx.schema.getClientsRequest({})
      const clients = await ctx.service.all(request)
      const response = clients

      await ctx.render('clients', {
        title: 'Client',
        clients: response,
        error: null
      })
    } catch (error) {
      await ctx.render('clients', {
        title: 'Clients',
        clients: null,
        error: 'The client does not exist or have been deleted'
      })
    }
  }

  // GET /clients/:id
  // Description: Returns a view displaying a specific client
  async oneView (ctx, next) {
    try {
      const request = ctx.schema.getClientRequest({
        id: ctx.params.id
      })
      const client = await ctx.service.one(request)
      const response = client

      await ctx.render('client', {
        title: 'Client',
        client: response,
        error: null
      })
    } catch (error) {
      await ctx.render('client', {
        title: 'Client',
        error: 'The client does not exist or have been deleted'
      })
    }
  }

  // GET /clients/edit
  // Description: Returns an edit form for client
  async createView (ctx, next) {
    await ctx.render('client-register', {
      title: 'Client Registration'
    })
  }

  // GET /clients/edit
  // Description: Return a view displaying the edit client form
  async updateView (ctx, next) {
    try {
      const request = ctx.schema.getClientRequest({
        id: ctx.params.id
      })
      const client = await ctx.service.one(request)
      // const response = schema.getClientResponse(client)

      await ctx.render('client-edit', {
        title: 'Client Edit',
        client: client,
        error: null
      })
    } catch (error) {
      await ctx.render('client', {
        title: 'Client',
        error: 'The client does not exist or have been deleted'
      })
    }
  }

  // GET /api/v1/clients
  // Description: Returns a list of clients
  async all (ctx, next) {
    const request = ctx.schema.getClientsRequest(ctx.query)
    const clients = await ctx.service.all(request)
    // const response = getClientsResponse(clients)
    ctx.status = 200
    ctx.body = clients
  }

  // GET /clients/:id
  // Description: Returns a client by id
  async one (ctx, next) {
    const request = schema.getClientRequest({
      _id: ctx.params.id
    })
    const client = await ctx.service.one(request)
    const response = client
    // this.set('Cache-Control', 'no-cache')
    // this.set('Pragma', 'no-cache')
    ctx.status = 200
    ctx.body = response
  }

  // POST /clients
  // Description: Create a new client
  async create (ctx, next) {
    try {
      const request = ctx.schema.postClientRequest({
        contacts: ctx.request.body.contacts,
        client_name: ctx.request.body.clientName,
        client_uri: ctx.request.body.clientURI,
        logo_uri: ctx.request.body.logoURI,
        tos_uri: ctx.request.body.tosURI,
        policy_uri: ctx.request.body.policyURI,
        redirect_uris: ctx.request.body.redirectURIs
      })
      const client = await ctx.service.create(request)
      // NOTE: the client object returned is not pure JSON, causing
      // error for AJV to parse
      const response = ctx.schema.postClientResponse(JSON.parse(JSON.stringify(client)))

      ctx.status = 200
      ctx.body = response
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle Mongoose Schema errors
        ctx.status = 400
        ctx.message = error.message
      } else if (error.name === 'Invalid Request') {
        // Handle AJV errors
        ctx.status = 400
        ctx.message = error.description
      } else {
        // Handle other errors
        throw error
      }
    }
  }

  async update (ctx, next) {
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

      const client = await ctx.service.update(ctx.params.id, request)
      const response = client

      ctx.status = 200
      ctx.body = client
    } catch (error) {
      if (error.name === 'ValidationError') {
        ctx.status = 400
        ctx.message = error.message
      } else {
        // Handle other errors
        throw error
      }
    }
  }
}
export default () => {
  return new Endpoint()
}
