
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import User from './model.js'

const route = new Router()

route.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.service = Service({
    db: User
  })
  await next()
})

route.get('/login', Endpoint.loginGet)
route.post('/login', Endpoint.loginPost)
route.get('/register', Endpoint.registerGet)
route.post('/register', Endpoint.registerPost)

export default route
