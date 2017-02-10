
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'

import schema from './schema.js'
// import broker from '../broker/create-device.js'
import channel from '../common/amqp.js'
import route from '../common/route.js'
import ExternalService from './external.js'

const route = new Router()
const endpoint = Endpoint()

route.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.channel = channel
  // ctx.broker = broker
  ctx.externalService = ExternalService()
  ctx.service = Service({ db: Model })
  await next()
})

// Internal API
route
.get(route.LOGIN, endpoint.loginView)
.post(route.LOGIN, endpoint.login)
.get(route.LOGIN_CALLBACK, endpoint.loginCallback)

route
.get(route.REGISTER, endpoint.registerView)
.post(route.REGISTER, endpoint.register)
.get(route.REGISTER_CALLBACK, endpoint.registerCallback)

// External API
route.post(route.LOGIN_API, endpoint.loginApi)
route.post(route.REGISTER_API, endpoint.registerApi)

export default route
