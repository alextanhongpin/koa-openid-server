
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'

import redis from '../common/redis.js'
import schema from './schema.js'

const router = new Router()
const endpoint = Endpoint()

router.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.service = Service({
    redis: redis
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
// route.post('/client-introspect', Endpoint.postClientIntrospect)
// route.post('/client-refresh', Endpoint.postClientRefreshToken)

export default router
