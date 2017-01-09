
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Code from './model.js'

const route = new Router()

route.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.service = Service({
    db: Code
  })
  await next()
})

// route.get('/authorize', Endpoint.getAuthorize)
// route.post('/authorize', Endpoint.postAuthorize)
// route.post('/token', Endpoint.postToken)
route.post('/token/introspect', Endpoint.introspect)

// The routes that the client will integrate
route.post('/client-introspect', Endpoint.postClientIntrospect)
// route.get('/connect', Endpoint.getConnect)
// route.get('/connect/callback', Endpoint.getConnectCallback)

export default route
