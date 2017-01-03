import Koa from 'koa'
import Router from 'koa-router'
import render from 'koa-ejs'
import logger from 'koa-logger'
import parser from 'koa-bodyparser'
import path from 'path'
import co from 'co'
import authsvc from './authsvc/transport.js'
import mongoose from './common/database.js'
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
.use(errors())
// .use(logger())
.use(parser())
.use(authsvc.routes())
.use(authsvc.allowedMethods())

// Catch-All Route
app.use(async (ctx, next) => {
  await ctx.render('home', {
    title: 'Hello'
  })
})

app.listen(PORT, () => {
  console.log(`listening to port *:${PORT}.\npress ctrl + c to cancel.`)
})

export default app
