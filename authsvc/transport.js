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

router
	.get('/login', endpoint.loginView) // Render the login page
	.post('/login', endpoint.login) // Post the login form
	.get('/login/callback', endpoint.loginCallback) // Handle the login callback

router
	.get('/register', endpoint.registerView) // Render the register page
	.post('/register', endpoint.register)// Post the register form
	.get('/register/callback', endpoint.registerCallback) // Handle the register callback

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
