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
    // Upon success, redirect the user to an empty page
    // first to create a new device and store the access
    // and refresh token locally
    // ctx.redirect('/profile/USER_ID_JWT')
    // ...or not
    // For mobile, it is best to just return the access and
    // refresh token directly
    // Invoke the next middleware

    requestmodule('/devices', {
      method: 'POST',
      headers: {
        'Authorization': '',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({})
    }, (err, res, body) => {
      if (err) {
        throw new Error('Unable to create device at the moment')
      }
      if (!err && response.statusCode === 200) {
        // body
        successResponse({
          access_token: '',
          refresh_token: ''
        }, 200)
      }
    })
  } catch (err) {
    errorResponse({
      error: err.message
    }, 400)
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
