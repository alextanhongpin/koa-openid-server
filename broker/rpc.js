const REPLY_QUEUE = 'service'
const amqp = require('amqplib')
const EventEmitter = require('events')

const createClient = (settings) => amqp.connect(settings.url)
.then((conn) => conn.createChannel())
.then((channel) => {
  channel.assertQueue(REPLY_QUEUE, { durable: false })
  channel.prefetch(1)

  channel.responseEmitter = new EventEmitter()
  channel.responseEmitter.setMaxListeners(0)
  channel.consume(REPLY_QUEUE, (msg) => {
    return channel.responseEmitter.emit(msg.properties.correlationId, msg.content)
  }, { noAck: true })

  return channel
})

const sendRPCMessage = (channel, message, rpcQueue) => {
  console.log('sending RPC message')
  return new Promise((resolve) => {
    const correlationId = '12345678'//uuid.v4()
    channel.responseEmitter.once(correlationId, resolve)
    channel.sendToQueue(rpcQueue, new Buffer(message), {
      correlationId,
      replyTo: REPLY_QUEUE
    })
  })
}

createClient({
  url: 'amqp://localhost'
}).then((channel) => {

  channel.assertQueue('', { exclusive: true }).then((q) => {
    console.log(q.queue)
    sendRPCMessage(channel, 'Hello world', q.queue).then((data) => {
      console.log(data)
    })
  })

})