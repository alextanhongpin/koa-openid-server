
import Router from 'koa-router'
import Endpoint from './endpoint.js'
const endpoint = Endpoint()
const route = new Router()
// View endpoints
route.get('/', endpoint.home)
route.get('/profile', endpoint.profile)
route.get('login', '/login', endpoint.login)
route.get('register', '/register', endpoint.register)

export default route
