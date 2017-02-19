
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'

import schema from './schema.js'

const router = new Router()
const endpoint = Endpoint()

router.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.service = Service({ db: Model })
  await next()
})

// Internal API
router
.get('/login', endpoint.loginView)
.post('/login', endpoint.login)
.get('/login/callback', endpoint.loginCallback)

router
.get('/register', endpoint.registerView)
.post('/register', endpoint.register)
.get('/register/callback', endpoint.registerCallback)

// External API
router.post('/api/v1/auth/login', endpoint.loginApi)
router.post('/api/v1/auth/register', endpoint.registerApi)

export default router
