// endpoint.js

// Login Endpoints
const getLogin = async(ctx, next) => {
  await ctx.render('auth', {
    title: 'Login'
  })
}

const postLogin = async(ctx, next) => {
  try {
    const request = postLoginRequest(ctx.request.body)
    const user = await ctx.service.login(request.email, request.password)
    const response = postLoginResponse(user)
    ctx.redirect('/profile')
  } catch (err) {
    ctx.redirect('/login?error=' + err.message)
  }
}

// Register Endpoints
const getRegister = async(ctx, next) => {
  await ctx.render('auth', {
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
    const deviceRequest = createDeviceRequest(ctx)
    const device = await ctx.service.createDevice(deviceRequest.user_id, deviceRequest.user_agent)
    const deviceResponse = createDeviceResponse(device)
    console.log(deviceResponse)
    ctx.redirect('/profile')
  } catch (err) {
    console.log(err)
    ctx.redirect('/login?error=' + err.message)
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

const successResponse = (ctx, response, status) => {
  ctx.body = response
  ctx.status = status
}

export default {
  getLogin,
  postLogin,
  getRegister,
  postRegister
  // getUsers
}
