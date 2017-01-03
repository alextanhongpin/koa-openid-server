// endpoint.js

// Login Endpoints
const getLogin = async(ctx, next) => {
  await ctx.render('auth', {
    title: 'Login'
  })
}

const postLogin = async(ctx, next) => {
  try {
    const request = loginPostRequest(ctx.request.body)
    const user = await ctx.service.login(request.email, request.password)
    const response = loginPostResponse(user)
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
  console.log('regiter user')
  try {
    const request = registerPostRequest(ctx.request.body)
    console.log(request)
    const user = await ctx.service.register(request.email, request.password)
    const response = registerPostResponse(user)
    ctx.redirect('/profile')
  } catch (err) {
    ctx.redirect('/login?error=' + err.message)
  }
}

// Users endpoints
// const getUsers = async(ctx, next) => {
//   const request = null
//   const users = await ctx.service.getUsers()
//   const response = users
//   successResponse(ctx, response, 200)
// }

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
  return {
    _id: res._id,
    username: res.username
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
