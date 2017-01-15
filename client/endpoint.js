// Endpoints

// GET /
const homeView = async(ctx, next) => {
  await ctx.render('profile', {
    title: 'Profile'
  })
}

export default {
  homeView
}
