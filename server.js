import Koa from 'koa'

import parser from 'koa-bodyparser'
// import convert from 'koa-convert'
import compress from 'koa-compress'
import render from 'koa-ejs'
// import logger from 'koa-logger'
// import mount from 'koa-mount'
import ratelimit from 'koa-ratelimit'
// import Router from 'koa-router'
import session from 'koa-session'
import serve from 'koa-static'
import userAgent from 'koa-useragent'

import path from 'path'
import redis from 'redis'
import co from 'co'

// Initialize Database
import './common/database.js'
import FeatureToggle from './common/feature-toggle.js'
import config from './common/config.js'

// import oauthsvc from './oauthsvc/transport.js'
import authsvc from './authsvc/transport.js'
import devicesvc from './devicesvc/transport.js'
import clientsvc from './clientsvc/transport.js'
import oauthsvc from './oauthsvc/transport.js'
import client from './client/transport.js'
import errors from './modules/errors.js'

// Constant
const PORT = config.get('port')

// Feature Toggle
const AUTHSVC = config.get('service.auth')
const OAUTHSVC = config.get('service.oauth')
const DEVICESVC = config.get('service.device')
const CLIENTSVC = config.get('service.client')
const CLIENT = config.get('route.client')

const app = new Koa()

const featureToggle = FeatureToggle(app)

app.keys = [
  'dbbc0cae-c0d0-422d-9a72-0b8e09d4fd55',
  '7b463fab-d854-4657-836b-31ff366a5c34'
]

app.use(session(app))

app.use(ratelimit({
  db: redis.createClient(),
  duration: 60000,
  max: 100,
  id (context) {
    return context.ip
  },
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  errorMessage: 'Sometimes You Just Have to Slow Down.'
}))

app.use(compress({
  filter (contentType) {
    return /text/i.test(contentType)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
})
app.context.render = co.wrap(app.context.render)

app
.use(serve(path.join(__dirname, 'public')))
.use(errors())
.use(userAgent())
// .use(logger())
.use(parser())

featureToggle.register({
  service: authsvc,
  name: 'authsvc',
  enabled: AUTHSVC
})

featureToggle.register({
  service: oauthsvc,
  name: 'oauthsvc',
  enabled: OAUTHSVC
})

featureToggle.register({
  service: devicesvc,
  name: 'devicesvc',
  enabled: DEVICESVC
})

featureToggle.register({
  service: client,
  name: 'client',
  enabled: CLIENT
})

featureToggle.register({
  service: clientsvc,
  name: 'clientsvc',
  enabled: CLIENTSVC
})

// .use(oauthsvc.routes())
// .use(oauthsvc.allowedMethods())

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`listening to port *:${PORT}.\npress ctrl + c to cancel.`)
  })
}

export default app
