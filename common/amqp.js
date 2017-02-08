import amqp from 'amqplib'

export default = () => {
  return amqp.connect(process.env.AMQP_URI)
  .then((connection) => {
    return connection.createChannel()
  })
  .then((channel) => {
    return channel
  })
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
