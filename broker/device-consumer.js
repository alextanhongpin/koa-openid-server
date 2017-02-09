// Another working example, but publishing to exchange
// instead of to queue directly

// import Channel from '../common/amqp.js'

// const DEVICE_EXCHANGE = 'device-service'
// const DEVICE_QUEUE = 'device'
// const TOPIC = 'create'

// export default ({ service }) => {
//   return new Promise((resolve, reject) => {
//     Channel().then((channel) => {
//       channel.assertExchange(DEVICE_EXCHANGE, 'direct', { autoDelete: false })
//       channel.assertQueue(DEVICE_QUEUE, { autoDelete: false })

//       channel.bindQueue(DEVICE_QUEUE, DEVICE_EXCHANGE, TOPIC).then((context) => {
//         channel.consume(context.queue, (message) => {
//           if (!message.content.toString()) {
//             return
//           }
//           console.log('[*] User Created: Proceed to create device for device session', message.content.toString())
//           const request = JSON.parse(message.content.toString())
//           console.log('request', request)
          
//           service.postDevice(request).then((device) => {
//             // console.log('[*] Device created successfully')
//             const reply = new Buffer(JSON.stringify(device))
//             channel.sendToQueue(message.properties.replyTo, reply, {
//               correlationId: request.user_id
//             })
//             channel.ack(message)
//             resolve(true)
//           })
//         }, {}, (error, ok) => {
//           reject(error)
//         })
//       })
//     })
//   })
// }
