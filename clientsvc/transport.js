
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Client from './model.js'

const route = new Router()
const endpoint = Endpoint()
// Default namespace is /clients

route.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.service = Service({
    db: Client
  })
  await next()
})

// View endpoints
route.get('/register/clients', endpoint.postClientView)
route.get('/clients', endpoint.getClientsView)
route.get('/clients/:id', endpoint.getClientView)
route.get('/clients/:id/edit', endpoint.getClientUpdateView)
// API Endpoints
// Note that the versioning is independent from other services
// This makes it easier to increase the versioning without affecting
// other services
route.get('/api/v1/clients', endpoint.all)
route.get('/api/v1/clients/:id', endpoint.one)
route.patch('/api/v1/clients/:id', endpoint.update)
route.post('/api/v1/clients', endpoint.create)

export default route
