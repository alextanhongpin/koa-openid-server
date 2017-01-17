// errors.js
//
// Description: Global error handling
//
const errors = () => {
  return async(ctx, next) => {
    try {
      await next()
    } catch (err) {
      // console.log('GlobalErrorHandling', err)
      ctx.body = {
        error: err.message,
        error_description: err.description
      }
      ctx.status = err.status || 500
    }
  }
}

export default errors
