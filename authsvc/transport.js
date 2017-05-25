// transport.js exposes the api routes through the endpoints
import Router from 'koa-router'

import Endpoint from './endpoint.js'
import schema from './schema.js'
import Service from './service.js'
import Model from './model.js'

const router = new Router()
const endpoint = Endpoint()

router.use(async(ctx, next) => {
	// This is an anti-pattern
	// Better to pass it through dependency injection
  ctx.schema = schema
  ctx.service = Service({ db: Model })
  await next()
})

// ============================================================================
//
// INTERNAL API
//
// ============================================================================

// Render the login page
router.get('/login', endpoint.loginView)

// Post the login form
router.post('/login', endpoint.login)

// Handle the login callback
router.get('/login/callback', endpoint.loginCallback)

// Render the register page
router.get('/register', endpoint.registerView)

// Post the register form
router.post('/register', endpoint.register)

// Handle the register callback
router.get('/register/callback', endpoint.registerCallback)

// ============================================================================
//
// EXTERNAL API
//
// ============================================================================

// Login API for mobile users
router.post('/api/v1/auth/login', endpoint.loginApi)

// Register API for mobile users
router.post('/api/v1/auth/register', endpoint.registerApi)

export default router
