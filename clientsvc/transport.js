
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Client from './model.js'


const route = new Router()
// Default namespace is /clients

route.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.service = Service({
    db: Client
  })
  await next()
})

// View endpoints
route.get('/register/clients', Endpoint.postClientView)
route.get('/clients', Endpoint.getClientsView)
route.get('/clients/:id', Endpoint.getClientView)
// API Endpoints
// Note that the versioning is independent from other services
// This makes it easier to increase the versioning without affecting
// other services
route.get('/api/v1/clients', Endpoint.getClients)
route.get('/api/v1/clients/:id', Endpoint.getClient)
route.post('/api/v1/clients', Endpoint.postClient)
// route.update('/api/v1/clients/:id', Endpoint.updateClient)
// route.update('/api/v1/clients/:id', Endpoint.deleteClient)

export default route
