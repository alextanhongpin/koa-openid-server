
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Client from './model.js'

import route from '../common/route.js'
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
router.get(route.CLIENTS_REGISTER, endpoint.postClientView)
router.get(route.CLIENTS, endpoint.getClientsView)
router.get(route.CLIENTS_ID, endpoint.getClientView)
router.get(route.CLIENTS_UPDATE, endpoint.getClientUpdateView)
// API Endpoints
// Note that the versioning is independent from other services
// This makes it easier to increase the versioning without affecting
// other services

// External API
router
.get(route.CLIENTS_API, endpoint.all)
.post(route.CLIENTS_API, endpoint.create)

router
.get(route.CLIENTS_ID_API, endpoint.one)
.patch(route.CLIENTS_ID_API, endpoint.update)

export default route
