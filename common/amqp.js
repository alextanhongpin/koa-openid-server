import amqp from 'amqplib'

export default () => {
  return amqp.connect(process.env.AMQP_URI)
  .then((connection) => {
    return connection.createChannel()
  })
  .then((channel) => {
    return channel
  })
}
