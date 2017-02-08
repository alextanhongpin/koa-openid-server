
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Device from './model.js'
import Channel from '../common/amqp.js'

import schema from './schema.js'
import CreateDeviceBroker from '../broker/create-device'
// HTTP Transport
const route = new Router()

route.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.service = Service({
    db: Device
  })
  await next()
})

// router.url('device', 3)
route.get('devices', '/devices', Endpoint.all)
route.get('device', '/devices/:id', Endpoint.one)
route.post('/devices', Endpoint.create)
// Only admin can access
// route.delete('/devices', Endpoint.destroy)

// AMQP Transport

// DeviceConsumer({
//   service: Service({ db: Device })
// }).then((success) => {
//   console.log('[*] Device created successfully')
// }).catch((error) => {
//   console.log(error)
// })

CreateDeviceBroker((request) => {
  // Schema.createDeviceRequest()
  return Service({ db: Device }).create(request).then((response) => {
    // Schema.createDeviceResponse()
    return response
  })
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
