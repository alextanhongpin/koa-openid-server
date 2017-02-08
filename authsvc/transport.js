
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'

import schema from './schema.js'
import broker from '../broker/create-device.js'
import channel from '../common/amqp.js'

const route = new Router()

route.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.channel = channel
  ctx.broker = broker
  ctx.service = Service({ db: Model })
  await next()
})

route.get('login', '/login', Endpoint.getLogin)
route.post('/login', Endpoint.postLogin)
route.get('register', '/register', Endpoint.getRegister)
route.post('/register', Endpoint.postRegister)

export default route
