
import Router from 'koa-router'
import Endpoint from './endpoint.js'

const route = new Router()
// View endpoints
route.get('/', Endpoint.homeView)

export default route
