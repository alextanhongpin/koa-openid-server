// endpoint.js
import noderequest from 'request'
import Channel from '../common/amqp.js'

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
    const request = postLoginRequest(ctx.request.body)
    const user = await ctx.service.login(request.email, request.password)
    const response = postLoginResponse(user)

    // CLIENT
    const message = JSON.stringify({
      user_id: response._id,
      user_agent: ctx.state.userAgent.source
    })

    const chan = await Channel()
    
    // Run the service in the background?
    ctx.body = await publishDevice({ chan, message, user_id: response._id.toString() })


  } catch (err) {
    errorResponse({
      error: err.message
    }, 400)
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
        //next()
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

const postDeviceMiddleware = async({ user_id }) => {
  return new Promise((resolve, reject) => {
    noderequest('http://localhost:3100/devices', {
      method: 'POST',
      headers: {
        // Client credentials grant
        // 'Authorization': '',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        user_id
      })
    }, (err, res, body) => {
      console.log(err, body)
      if (err) {
        throw new Error('Unable to create device at the moment')
      }
      if (!err && res.statusCode === 200) {
        // body
        resolve(JSON.parse(body))
      }
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
    const request = postRegisterRequest(ctx.request.body)
    const user = await ctx.service.register(request.email, request.password)
    const response = postRegisterResponse(user)

    // Store the user's id in the context's state
    ctx.state.user_id = response._id
    ctx.state.user_agent = ctx.state.userAgent.source
    
    const deviceRequest = postDeviceMiddlewareRequest(ctx.state)
    const device = await postDeviceMiddleware(deviceRequest)
    const deviceResponse = postDeviceMiddlewareResponse(device)

    successResponse(ctx, deviceResponse, 200)
  } catch (err) {
    console.log(err)
    ctx.redirect('/login?error=' + err.message)
    errorResponse(err, 400)
  }
}

// Requests/Responses

const postLoginRequest = (req) => {
  return {
    email: req.email,
    password: req.password
  }
}
const postLoginResponse = (res) => {
  return {
    _id: res._id,
    username: res.username
  }
}

const postRegisterRequest = (req) => {
  return {
    email: req.email,
    password: req.password
  }
}
const postRegisterResponse = (res) => {
  return res
}

const createDeviceRequest = (req) => {
  return {
    user_agent: req.headers['user-agent'],
    user_id: req.state.user_id
  }
}

const createDeviceResponse = (res) => {
  return {
    access_token: res.access_token,
    refresh_token: res.refresh_token
  }
}

const postDeviceMiddlewareRequest = (req) => {
  return {
    user_id: req.user_id,
    user_agent: req.user_agent
  }
}
const postDeviceMiddlewareResponse = (res) => {
  return {
    access_token: res.access_token,
    refresh_token: res.refresh_token
  }
}
const successResponse = (ctx, response, status) => {
  ctx.body = response
  ctx.status = status
}
const errorResponse = (ctx, error, status) => {
  ctx.body = error
  ctx.status = status
}

export default {
  getLogin,
  postLogin,
  getRegister,
  postRegister
  // getUsers
}
