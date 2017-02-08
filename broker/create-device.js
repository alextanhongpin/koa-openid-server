
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

function consumer (service) {
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
            service(request).then((response) => {
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

// consumer((params) => {
//   return this.db.findOne(params)
// })
// const id = Math.floor(Math.random() * 10).toString()
// const payload = 'Hello world'
// producer(id, payload)

module.exports = { producer, consumer }