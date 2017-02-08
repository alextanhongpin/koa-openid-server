
import Router from 'koa-router'
import Endpoint from './endpoint.js'
import Service from './service.js'
import Model from './model.js'
import Channel from '../common/amqp.js'


import schema from './schema.js'
import CreateDeviceBroker from '../broker/create-device'
// HTTP Transport
const route = new Router()
const endpoint = Endpoint()
const service = Service({ db: Model })

route.use(async(ctx, next) => {
  ctx.schema = schema
  ctx.service = service
  await next()
})

// router.url('device', 3)
route.get('/devices', endpoint.all)
route.get('/devices/:id', endpoint.one)
route.post('/devices', endpoint.create)
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

CreateDeviceBroker.consumer(service.create.bind(service))
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
