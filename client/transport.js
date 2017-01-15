
import Router from 'koa-router'
import Endpoint from './endpoint.js'

const route = new Router()
// View endpoints
route.get('/', Endpoint.homeView)
route.get('/profile', Endpoint.profileView)

export default route
