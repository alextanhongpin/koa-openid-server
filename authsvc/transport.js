
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import User from './model.js'

import schema from './schema.js'
import channel from '../common/amqp.js'

const route = new Router()

route.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.channel = channel
  ctx.service = Service({ db: User })
  await next()
})

route.get('/login', Endpoint.getLogin)
route.post('/login', Endpoint.postLogin)

route.get('/register', Endpoint.getRegister)
route.post('/register', Endpoint.postRegister)

export default route
