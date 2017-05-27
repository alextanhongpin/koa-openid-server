
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
router
	.get('/authorize', endpoint.getAuthorize)
	.post('/authorize', endpoint.postAuthorize, endpoint.checkUser) // Check if the user provides the correct access token
	// .get('/client-connect', endpoint.getClientConnect)
	.post('/token', endpoint.token)
	.post('/token/refresh', endpoint.refresh)
	.post('/token/introspect', endpoint.introspect)

// TODO: Delete unused routes
// route.get('/connect', Endpoint.getConnect)
// route.get('/connect/callback', Endpoint.getConnectCallback)
// route.post('/client-introspect', Endpoint.postClientIntrospect)
// route.post('/client-refresh', Endpoint.postClientRefreshToken)

export default router
