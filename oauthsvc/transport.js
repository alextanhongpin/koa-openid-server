
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
// import CodeModel from './model.js'
import redis from '../common/redis.js'

// Import External Model
// It's bad to have external dependencies,
// until there's a better solution, this is how we are
// gonna use it
import ClientModel from '../clientsvc/model.js'
import DeviceModel from '../devicesvc/model.js'

const route = new Router()

route.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.service = Service({
    redis,
    Client: ClientModel,
    Device: DeviceModel
  })
  await next()
})

// only authorized user can log in
route.get('/authorize', Endpoint.getAuthorize)
route.post('/authorize', Endpoint.postAuthorize, Endpoint.checkUser, Endpoint.cacheAuthorizationCode)
// route.post('/token', Endpoint.postToken)
route.get('/client-connect', Endpoint.getClientConnect)
route.post('/token', Endpoint.token)
route.post('/token/refresh', Endpoint.refresh)
route.post('/token/introspect', Endpoint.introspect)

// The routes that the client will integrate
route.post('/client-introspect', Endpoint.postClientIntrospect)
route.post('/client-refresh', Endpoint.postClientRefreshToken)
route.get('/client-authorize', Endpoint.getClientAuthorize)
route.get('/client-authorize/callback', Endpoint.getClientAuthorizeCallback)
// route.get('/connect', Endpoint.getConnect)
// route.get('/connect/callback', Endpoint.getConnectCallback)

export default route
