import amqp from 'amqplib'

const ok = amqp.connect(process.env.AMQP_URI)
.then((conn) => {
  return conn.createChannel()
})

const chan = ok.then((ch) => {
  return ch
})

export default () => {
  return chan
}
/*
// Usage
import Channel from './worker.js'
const chan = await Channel()
// Consumer
chan.assertQueue(worker.queue, worker.option)
chan.consume(worker.queue, (msg) => {
  console.log('[*] User Created: Proceed to create device for device session', msg.content.toString())
})
// Producer
chan.assertQueue(worker.queue, worker.option)
chan.sendToQueue(queueName, new Buffer('hello world'))
*/
