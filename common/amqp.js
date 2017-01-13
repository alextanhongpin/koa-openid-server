import amqp from 'amqplib'
process.env.AMQP_URI = 'amqp://localhost'

const channel = amqp.connect(process.env.AMQP_URI).then((conn) => {
  return conn.createChannel()
})

const worker = {
  queue: 'device',
  option: {
    durable: false
  }
}

export default () => {
  return channel
}
/*
// Usage
import Channel from './worker.js'
const chan = await Channel()
// Consumer
chan.assert(worker.queue, worker.option)
chan.consume(worker.queue, (msg) => {
  console.log('[*] User Created: Proceed to create device for device session', msg.content.toString())
})
// Producer
chan.assert(worker.queue, worker.option)
chan.sendToQueue(queueName, new Buffer('hello world'))
*/
