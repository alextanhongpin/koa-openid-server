import Koa from 'koa'
import Router from 'koa-router'
import render from 'koa-ejs'
import logger from 'koa-logger'
import serve from 'koa-static'
import userAgent from 'koa-useragent'
import parser from 'koa-bodyparser'
import mount from 'koa-mount'
import path from 'path'
import co from 'co'
import _ from './common/database.js'

import oauthsvc from './oauthsvc/transport.js'
import authsvc from './authsvc/transport.js'
import devicesvc from './devicesvc/transport.js'
import clientsvc from './clientsvc/transport.js'
import client from './client/transport.js'

import errors from './modules/errors.js'

const PORT = process.env.PORT
const app = new Koa()

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
// .use(clientsvc.routes())
// .use(clientsvc.allowedMethods())
// .use(oauthsvc.routes())
// .use(oauthsvc.allowedMethods())
// .use(client.routes())
// .use(client.allowedMethods())

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
