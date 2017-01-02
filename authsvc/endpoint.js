// endpoint.js

// Login Endpoints
const loginGet = async(ctx, next) => {
  await ctx.render('auth', {
    title: 'Login'
  })
}

const loginPost = async(ctx, next) => {
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
const registerGet = async(ctx, next) => {
  await ctx.render('auth', {
    title: 'Register'
  })
}

const registerPost = async(ctx, next) => {
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

const loginPostRequest = (req) => {
  return {
    email: req.email,
    password: req.password
  }
}
const loginPostResponse = (res) => {
  return {
    _id: res._id,
    username: res.username
  }
}

const registerPostRequest = (req) => {
  return {
    email: req.email,
    password: req.password
  }
}
const registerPostResponse = (res) => {
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
  loginGet,
  loginPost,
  registerGet,
  registerPost
  // getUsers
}
