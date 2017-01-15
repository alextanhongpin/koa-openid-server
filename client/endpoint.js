// Endpoints

// GET /
const homeView = async(ctx, next) => {
  await ctx.render('home', {
    title: 'Home'
  })
}
const profileView = async(ctx, next) => {
  await ctx.render('profile', {
    title: 'Profile'
  })
}
export default {
  homeView,
  profileView
}
