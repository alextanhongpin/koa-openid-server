
import Router from 'koa-router'
import Endpoint from './endpoint.js'
const endpoint = Endpoint()
const route = new Router()
// View endpoints
route.get('/', endpoint.home)
route.get('/profile', endpoint.profile)
route.get('login', '/login', endpoint.login)
route.get('register', '/register', endpoint.register)



// The routes that the client will integrate
// route.post('/client-introspect', Endpoint.postClientIntrospect)
// route.post('/client-refresh', Endpoint.postClientRefreshToken)
// route.get('/client-authorize', Endpoint.getClientAuthorize)
// route.get('/client-authorize/callback', Endpoint.getClientAuthorizeCallback)
export default route
