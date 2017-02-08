
const amqp = require('amqplib')

const DEVICE_EXCHANGE = 'device-service'
const DEVICE_QUEUE = 'device'
const TOPIC = 'create'

function connect () {
  return amqp.connect('amqp://localhost')
}
function producer (id, payload) {
  connect()
  .then((connection) => {
    connection.createChannel().then((channel) => {
      const ok = channel.assertQueue('', { exclusive: true })
      .then((q) => q.queue)

      ok.then((queue) => {
        console.log('producer', queue)
        channel.consume(queue, (msg) => {
          console.log('producer:consume', msg)
          if (msg.properties.correlationId === id) {
            console.log('match results')
            setTimeout(() => {
              connection.close()
              process.exit(0)
            }, 500)
          }
        }, {
          noAck: true
        }, (error, ok) => {
          console.log(error)
        })

        console.log('producer:sendToQueue')
        channel.sendToQueue(DEVICE_QUEUE, new Buffer(payload), {
          correlationId: id,
          replyTo: queue
        })
      })
    })
  })
}

function consumer (service) {
  connect()
  .then((connection) => {
    connection.createChannel().then((channel) => {

      console.log('consumer:sendToQueue')
      const ok = channel.assertQueue(DEVICE_QUEUE)
      .then((q) => q.queue)
      
      ok.then((queue) => {
        channel.consume(queue, (msg) => {
          console.log('received from queue', msg)
          service(JSON.parse(message.content.toString())).then((response) => {
            channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(response)), {
              correlationId: msg.properties.correlationId
            })
            channel.ack(msg)
          }).catch((error) => {
            channel.nack(msg)
          })
        })
      }, {}, (error, ok) => {
        console.log(error)
      })
    })
  })
}

consumer((params) => {
  return this.db.findOne(params)
})
const id = Math.floor(Math.random() * 10).toString()
const payload = 'Hello world'
producer(id, payload)

module.exports = { producer, consumer }