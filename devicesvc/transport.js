
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'

import schema from './schema.js'
const router = new Router()
const endpoint = Endpoint()
const service = Service({ db: Model })

router.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.service = service
  await next()
})

// Devices Services v1
router
.get('/api/v1/devices/health-check', endpoint.healthCheck)

router
.get('/api/v1/devices', endpoint.all)
.get('/api/v1/devices/:id', endpoint.one)
.post('/api/v1/devices', endpoint.create)

// List all routes
// console.log(router.stack.map(i => i.path))
export default router
