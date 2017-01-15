// endpoint.js
// import noderequest from 'request'
import Channel from '../common/amqp.js'
import schema from './schema.js'

const worker = {
  exchange: 'devicesvc',
  route: 'create',
  queue: 'device',
  option: {
    durable: false
  }
}
// Login Endpoints
const getLogin = async(ctx, next) => {
  await ctx.render('login', {
    title: 'Login'
  })
}

const postLogin = async(ctx, next) => {
  try {
    const request = schema.loginRequest(ctx.request.body)
    const user = await ctx.service.login(request.email, request.password)
    const response = schema.loginResponse({
      email: user.email
    })
    console.log('response', user, response)
    // CLIENT
    const message = JSON.stringify({
      user_id: user.id,
      user_agent: ctx.state.userAgent.source
    })
    // Create a new channel
    const chan = await Channel()
    ctx.body = await publishDevice({ chan, message, user_id: user.id })
    ctx.status = 200
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      error: err.message
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

    // chan.publish(worker.exchange, worker.route, new Buffer(message), {
    //   correlationId: response._id,
    //   replyTo: worker.queue
    // })
      chan.consume(q.queue, (msg) => {
        console.log('chan consume at POST /login', msg)
        if (msg.properties.correlationId === user_id) {
        // Action completed

          const device = JSON.parse(msg.content.toString())
          console.log(device, 'device')
        // chan.close()
        // next()
        // chan.close()

          resolve(device)

        // ctx.status = 200

        // msg.ack(msg)
        // successResponse(ctx, device, 200)
        }
      }, { noAck: true }, (err, ok) => {
        console.log(err, ok)
      })
    // chan.assertQueue(worker.queue, { exclusive: true })

      chan.sendToQueue(worker.queue, new Buffer(message), {
        correlationId: user_id,
        replyTo: q.queue
      })
    })
  })
}

// Register Endpoints
const getRegister = async(ctx, next) => {
  await ctx.render('register', {
    title: 'Register'
  })
}

const postRegister = async(ctx, next) => {
  try {
    const request = schema.registerRequest(ctx.request.body)
    const user = await ctx.service.register(request.email, request.password)
    const response = schema.registerResponse({
      email: user.email
    })
    // CLIENT
    const message = JSON.stringify({
      user_id: user.id,
      user_agent: ctx.state.userAgent.source
    })
    // Create a new channel
    const chan = await Channel()
    ctx.body = await publishDevice({ chan, message, user_id: user._id.toString() })
    ctx.status = 200
  } catch (err) {
    ctx.redirect('/login?error=' + err.message)
  }
}

export default {
  getLogin,
  postLogin,
  getRegister,
  postRegister
  // getUsers
}
