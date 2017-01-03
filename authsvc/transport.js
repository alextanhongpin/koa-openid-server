
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

route.get('/login', Endpoint.getLogin)
route.post('/login', Endpoint.postLogin)
route.get('/register', Endpoint.getRegister)
route.post('/register', Endpoint.postRegister)

export default route
