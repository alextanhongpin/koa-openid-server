
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Device from './model.js'

const route = new Router()

route.use(async(ctx, next) => {
  // Manually inject the service in the context
  ctx.service = Service({
    db: Device
  })
  await next()
})

route.get('/devices', Endpoint.getDevices)
route.get('/devices/:id', Endpoint.getDevice)
route.post('/devices', Endpoint.postDevice)
// Only admin can access
// route.delete('/devices', Endpoint.destroy)
export default route
