
import Router from 'koa-router'
import endpoint from './endpoint.js'
import Service from './service.js'
// import CodeModel from './model.js'
import redis from '../common/redis.js'
import schema from './schema.js'

// Import External Model
// It's bad to have external dependencies,
// until there's a better solution, this is how we are
// gonna use it
import Model from '../clientsvc/model.js'

const router = new Router()
const endpoint = Endpoint()

router.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.schema = schema
  ctx.service = Service({
    // Services datastore
    redis: redis,
    db: Model
  })
  await next()
})

// only authorized user can log in
router.get('/authorize', endpoint.getAuthorize)
router.post('/authorize', endpoint.postAuthorize, endpoint.checkUser)
// route.post('/token', Endpoint.postToken)
router.get('/client-connect', endpoint.getClientConnect)
router.post('/token', endpoint.token)
router.post('/token/refresh', endpoint.refresh)
router.post('/token/introspect', endpoint.introspect)

// route.get('/connect', Endpoint.getConnect)
// route.get('/connect/callback', Endpoint.getConnectCallback)

export default router
