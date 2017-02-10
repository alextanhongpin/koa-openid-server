
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'

import schema from './schema.js'
// import broker from '../broker/create-device.js'
import channel from '../common/amqp.js'
import route from '../common/route.js'
import ExternalService from './external.js'

const router = new Router()
const endpoint = Endpoint()

router.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.channel = channel
  // ctx.broker = broker
  ctx.externalService = ExternalService()
  ctx.service = Service({ db: Model })
  await next()
})

// Internal API
router
.get(route.LOGIN, endpoint.loginView)
.post(route.LOGIN, endpoint.login)
.get(route.LOGIN_CALLBACK, endpoint.loginCallback)

router
.get(route.REGISTER, endpoint.registerView)
.post(route.REGISTER, endpoint.register)
.get(route.REGISTER_CALLBACK, endpoint.registerCallback)

// External API
router.post(route.LOGIN_API, endpoint.loginApi)
router.post(route.REGISTER_API, endpoint.registerApi)

export default router
