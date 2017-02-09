// This is an example of RPC messaging with RabbitMQ
// that works, but not implemented due to several complexity
// 1. Error Handling - How to handle errors
// 2. Business logic - How to separate business logic from the message bus
// 3. Harder to implement compared to just calling the REST api

const amqp = require('amqplib')

const DEVICE_EXCHANGE = 'device-service'
const DEVICE_QUEUE = 'device'
const TOPIC = 'create'

function connect () {
  return amqp.connect('amqp://localhost')
}
function producer ({id, payload}) {
  return new Promise((resolve, reject) => {
    connect()
    .then((connection) => {
      connection.createChannel().then((channel) => {
        const ok = channel.assertQueue('', { exclusive: true })
        .then((q) => q.queue)

        ok.then((queue) => {
          channel.consume(queue, (msg) => {
            if (msg.properties.correlationId === id) {
              resolve(JSON.parse(msg.content.toString()))
              setTimeout(() => {
                connection.close()
                process.exit(0)
              }, 500)
            }
          }, {
            noAck: true
          }, (error, ok) => {
            reject(error)
          })
          channel.sendToQueue(DEVICE_QUEUE, new Buffer(JSON.stringify(payload)), {
            correlationId: id,
            replyTo: queue
          })
        })
      })
    })
  })
}

function consumer ({ service }) {
  connect()
  .then((connection) => {
    connection.createChannel().then((channel) => {

      const ok = channel.assertQueue(DEVICE_QUEUE)
      .then((q) => q.queue)
      
      ok.then((queue) => {
        channel.consume(queue, (message) => {
          const request = JSON.parse(message.content.toString())
          if (!request) {
            return
          } else {
            // const parsedRequest = parseRequest(request)
            service(request).then((response) => {
              // const parsedResponse = parseResponse(response)
              channel.sendToQueue(message.properties.replyTo, new Buffer(JSON.stringify(response)), {
                correlationId: message.properties.correlationId
              })
            })
          }
          channel.ack(message)
        })
      }, {}, (error, ok) => {
        console.log(error)
      })
    })
  })
}

// PRODUCER Example
// const device = await ctx.broker.producer({
//   payload: {
//     user_id: user.id,
//     user_agent: ctx.state.userAgent.source
//   },
//   id: user.id
// })

// CONSUMER example
// import CreateDeviceBroker from '../broker/create-device'
// CreateDeviceBroker.consumer({
//   service: service.create.bind(service),
//   // parseRequest: schema.postDeviceRequest,
//   // parseResponse: schema.postDeviceResponse
// })

module.exports = { producer, consumer }