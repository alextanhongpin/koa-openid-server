
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import CodeService from './service.js'
import CodeModel from './model.js'

// Import External Service
import ClientModel from '../clientsvc/model.js'

const route = new Router()

route.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.service = Service({
    Code: CodeModel,
    Client: ClientModel
  })
  await next()
})

// route.get('/authorize', Endpoint.getAuthorize)
// route.post('/authorize', Endpoint.postAuthorize)
// route.post('/token', Endpoint.postToken)
route.post('/token/refresh', Endpoint.refresh)
route.post('/token/introspect', Endpoint.introspect)

// The routes that the client will integrate
route.post('/client-introspect', Endpoint.postClientIntrospect)
route.post('/client-refresh', Endpoint.postClientRefreshToken)
// route.get('/connect', Endpoint.getConnect)
// route.get('/connect/callback', Endpoint.getConnectCallback)

export default route
