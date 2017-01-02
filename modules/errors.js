// errors.js
//
// Description: Global error handling
//
const errors = () => {
  return async(ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.body = { message: err.message }
      ctx.status = err.status || 500
    }
  }
}

export default errors
