import Koa from 'koa'

import parser from 'koa-bodyparser'
import convert from 'koa-convert'
import compress from 'koa-compress'
import render from 'koa-ejs'
import logger from 'koa-logger'
import mount from 'koa-mount'
import Router from 'koa-router'
import session from 'koa-session'
import serve from 'koa-static'
import userAgent from 'koa-useragent'

import path from 'path'
import co from 'co'
import _ from './common/database.js'

import oauthsvc from './oauthsvc/transport.js'
import authsvc from './authsvc/transport.js'
import devicesvc from './devicesvc/transport.js'
// import clientsvc from './clientsvc/transport.js'
import client from './client/transport.js'

import errors from './modules/errors.js'

const PORT = process.env.PORT
const app = new Koa()

app.keys = ['dbbc0cae-c0d0-422d-9a72-0b8e09d4fd55', '7b463fab-d854-4657-836b-31ff366a5c34']
app.use(convert(session()))

app.use(compress({
  filter: function (content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

app.use(new CSRF({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  disableQuery: false
}))

app.use((ctx, next) => {
  if (![ 'GET', 'POST' ].includes(ctx.method))
    return next()
  if (ctx.method === 'GET') {
    ctx.body = ctx.csrf
    return
  }
  ctx.body = 'OK'
})

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
.use(authsvc.routes())
.use(authsvc.allowedMethods())
.use(devicesvc.routes())
.use(devicesvc.allowedMethods())
.use(client.routes())
.use(client.allowedMethods())
// .use(clientsvc.routes())
// .use(clientsvc.allowedMethods())
// .use(oauthsvc.routes())
// .use(oauthsvc.allowedMethods())

// // Catch-All Route
// app.use(async (ctx, next) => {
//   await ctx.render('home', {
//     title: 'Hello'
//   })
// })

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`listening to port *:${PORT}.\npress ctrl + c to cancel.`)
  })
}

export default app
