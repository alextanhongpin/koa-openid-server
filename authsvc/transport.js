
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'

import schema from './schema.js'
import broker from '../broker/create-device.js'
import channel from '../common/amqp.js'

const route = new Router()
const endpoint = Endpoint()

route.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.channel = channel
  ctx.broker = broker
  ctx.service = Service({ db: Model })
  await next()
})

route.get('login', '/login', endpoint.getLogin)
route.post('/login', endpoint.postLogin)
route.get('register', '/register', endpoint.getRegister)
route.post('/register', endpoint.postRegister)

export default route
