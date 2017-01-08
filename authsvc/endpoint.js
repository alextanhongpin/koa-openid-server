// endpoint.js
import noderequest from 'request'

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
    // Store the user's id in the context's state
    ctx.state.user_id = response._id
    ctx.state.user_agent = ctx.state.userAgent.source

    const deviceRequest = postDeviceMiddlewareRequest(ctx.state)
    const device = await postDeviceMiddleware(deviceRequest)
    const deviceResponse = postDeviceMiddlewareResponse(device)

    successResponse(ctx, deviceResponse, 200)
  } catch (err) {
    errorResponse({
      error: err.message
    }, 400)
  }
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
