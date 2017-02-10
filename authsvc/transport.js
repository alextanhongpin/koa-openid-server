
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'

import schema from './schema.js'
import broker from '../broker/create-device.js'
import channel from '../common/amqp.js'
import ExternalService from './external.js'

const route = new Router()
const endpoint = Endpoint()

route.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.channel = channel
  ctx.broker = broker
  ctx.externalService = ExternalService()
  ctx.service = Service({ db: Model })
  await next()
})

// Internal API
route
.get('/login', endpoint.loginView)
.post('/login', endpoint.login)
.get('/login/callback', endpoint.loginCallback)

route
.get('/register', endpoint.registerView)
.post('/register', endpoint.register)
.get('/register/callback', endpoint.registerCallback)

// External API
route.post('/api/v1/auth/login', endpoint.loginApi)
route.post('/api/v1/auth/register', endpoint.registerApi)

export default route
