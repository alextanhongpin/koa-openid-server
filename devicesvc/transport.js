
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'
import Channel from '../common/amqp.js'


import schema from './schema.js'

// HTTP Transport
const route = new Router()
const endpoint = Endpoint()
const service = Service({ db: Model })

route.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.service = service
  await next()
})

// Devices Services v1
route.get('/api/v1/devices', endpoint.all)
route.get('/api/v1/devices/:id', endpoint.one)
route.post('/api/v1/devices', endpoint.create)



export default route
