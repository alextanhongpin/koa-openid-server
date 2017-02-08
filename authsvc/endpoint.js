// endpoint.js
// import noderequest from 'request'

import DeviceProducer from '../broker/device-producer.js'

const worker = {
  exchange: 'devicesvc',
  route: 'create',
  queue: 'device',
  option: {
    durable: false
  }
}
// Login Endpoints

class Endpoints {
  async getLogin (ctx, next) {
    await ctx.render('login', {
      title: 'Login'
    })
  }
  async postLogin (ctx, next) {
    try {
      // Parse the request
      const request = ctx.schema.loginRequest(ctx.request.body)
      // Call the sevice
      const user = await ctx.service.login(request)
      // Parse the response
      const response = ctx.schema.loginResponse(user)
      // Payload
      const message = JSON.stringify({
        user_id: user.id,
        user_agent: ctx.state.userAgent.source
      })

      // Publish to a message broker to create a new device
      const device = await DeviceProducer({
        payload: message,
        id: user.id
      })

      ctx.body = device
      ctx.status = 200
    } catch (err) {
      ctx.status = 400
      ctx.body = {
        error: err.message
      }
    }
  }
  // Register Endpoints
  async getRegister (ctx, next) {
    await ctx.render('register', {
      title: 'Register'
    })
  }

  async postRegister(ctx, next) {
    try {
      const request = ctx.schema.registerRequest(ctx.request.body)
      const user = await ctx.service.register(request)
      const response = ctx.schema.registerResponse({
        email: user.email
      })
      // CLIENT
      const message = JSON.stringify({
        user_id: user.id,
        user_agent: ctx.state.userAgent.source
      })
      const chan = await ctx.channel()
      ctx.body = await publishDevice({ chan, message, user_id: user._id.toString() })
      ctx.status = 200
    } catch (err) {
      ctx.redirect('/login?error=' + err.message)
    }
  }
}


const publishDevice = ({ chan, message, user_id }) => {
  return new Promise((resolve, reject) => {
    chan.assertExchange(worker.exchange, 'direct', { autoDelete: false })
    chan.assertQueue(worker.queue, { autoDelete: false })
    chan.bindQueue(worker.queue, worker.exchange, 'create')

    chan.assertQueue('', {
      autoDelete: false,
      exclusive: true
    }).then((q) => {
      chan.bindQueue(q.queue, worker.exchange)
      chan.consume(q.queue, (msg) => {
        console.log('chan consume at POST /login', msg)
        if (msg.properties.correlationId === user_id) {
          // Action completed
          const device = JSON.parse(msg.content.toString())
          resolve(device)
        }
      }, { noAck: true }, (err, ok) => {
        console.log(err, ok)
      })
      chan.sendToQueue(worker.queue, new Buffer(message), {
        correlationId: user_id,
        replyTo: q.queue
      })
    })
  })
}

export default Endpoints
