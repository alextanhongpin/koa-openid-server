
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Client from './model.js'

import schema from './schema.js'

const route = new Router()
const endpoint = Endpoint()
// Default namespace is /clients

route.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.schema = schema
  ctx.service = Service({
    db: Client
  })
  await next()
})

// View endpoints
route.get('/clients/register', endpoint.postClientView)
route.get('/clients', endpoint.getClientsView)
route.get('/clients/:id', endpoint.getClientView)
route.get('/clients/:id/edit', endpoint.getClientUpdateView)
// API Endpoints
// Note that the versioning is independent from other services
// This makes it easier to increase the versioning without affecting
// other services
route
.get('/api/v1/clients', endpoint.all)
.post('/api/v1/clients', endpoint.create)

route
.get('/api/v1/clients/:id', endpoint.one)
.patch('/api/v1/clients/:id', endpoint.update)


export default route
