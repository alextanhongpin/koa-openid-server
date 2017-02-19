
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Client from './model.js'

import schema from './schema.js'

const router = new Router()
const endpoint = Endpoint()
// Default namespace is /clients

router.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.schema = schema
  ctx.service = Service({
    db: Client
  })
  await next()
})

// Internal API
router.get('/register/clients', endpoint.createView)
router.get('/clients', endpoint.allView)
router.get('/clients/:id', endpoint.oneView)
router.get('/clients/:id/edit', endpoint.updateView)
// API Endpoints
// Note that the versioning is independent from other services
// This makes it easier to increase the versioning without affecting
// other services

// External API
router
.get('/api/v1/clients', endpoint.all)
.get('/api/v1/clients/:id', endpoint.one)
.post('/api/v1/clients', endpoint.create)
.patch('/api/v1/clients/:id', endpoint.update)

export default router
