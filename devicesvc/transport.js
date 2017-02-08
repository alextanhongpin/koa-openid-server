
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Device from './model.js'
import Channel from '../common/amqp.js'

import schema from './schema.js'
import DeviceConsumer from '../broker/device-consumer'
// HTTP Transport
const route = new Router()

route.use(async(ctx, next) => {
  ctx.schema = schema
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

// AMQP Transport

DeviceConsumer({
  service: Service({ db: Device })
}).then((success) => {
  console.log('[*] Device created successfully')
}).catch((error) => {
  console.log(error)
})
// Channel().then((chan) => {

//   const service = Service({
//     db: Device
//   })

//   const worker = {
//     route: 'create',
//     exchange: 'devicesvc',
//     queue: 'device',
//     option: {
//       durable: false
//     }
//   }
//   chan.assertExchange(worker.exchange, 'direct', { autoDelete: false })
//   chan.assertQueue(worker.queue, { autoDelete: false })

//   chan.bindQueue(worker.queue, worker.exchange, 'create').then((q) => {
//     chan.consume(q.queue, (msg) => {
//       if (!msg.content.toString()) {
//         return
//       }
//       console.log('[*] User Created: Proceed to create device for device session', msg.content.toString())
//       const request = JSON.parse(msg.content.toString())
//       console.log('request', request)
      
//       service.postDevice(request).then((device) => {
//         console.log('device created successfully')
//         const reply = new Buffer(JSON.stringify(device))
//         chan.sendToQueue(msg.properties.replyTo, reply, {
//           correlationId: request.user_id
//         })
//         // chan.publish(worker.exchange, 'create', reply, {
//         //   correlationId: request.user_id
//         // })
//         chan.ack(msg)
//       })
//     }, {}, (err, ok) => {
//       console.log(err, ok)
//     })
//   })
// })
export default route
