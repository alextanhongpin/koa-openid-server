import Channel from '../common/amqp.js'

const DEVICE_EXCHANGE = 'device-service'
const DEVICE_QUEUE = 'device'
const TOPIC = 'create'

export default ({ payload, id }) => {
  return new Promise((resolve, reject) => {
    Channel().then((channel) => {
      channel.assertExchange(DEVICE_EXCHANGE, 'direct', { autoDelete: false })
      channel.assertQueue(DEVICE_QUEUE, { autoDelete: false })
      channel.bindQueue(DEVICE_QUEUE, DEVICE_EXCHANGE, TOPIC)
      channel.assertQueue('', {
        autoDelete: false,
        exclusive: true
      }).then((context) => {
        channel.bindQueue(context.queue, DEVICE_EXCHANGE)
        channel.consume(context.queue, (message) => {
          const isMatched = message.properties.correlationId === id
          if (isMatched) {
            const device = JSON.parse(message.content.toString())
            resolve(device)
            // Close the connection
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

        channel.sendToQueue(DEVICE_QUEUE, new Buffer(payload), {
          correlationId: id,
          replyTo: context.queue
        })
      })
    })
  })
}
