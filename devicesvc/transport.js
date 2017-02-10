
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'
// import Channel from '../common/amqp.js'


import schema from './schema.js'

// HTTP Transport
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
.get('/api/v1/devices/:id', endpoint.one)

router
.get('/api/v1/devices', endpoint.all)
.post('/api/v1/devices', endpoint.create)

// List all routes
console.log(router.stack.map(i => i.path))
export default router
