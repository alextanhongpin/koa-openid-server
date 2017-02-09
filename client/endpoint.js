// Endpoints

// GET /
class Endpoint {
	async home (ctx, next) {
		await ctx.render('home', {
			title: 'Home'
		})
	}
	async profile (ctx, next) {
		await ctx.render('profile', {
			title: 'Profile'
		})
	}
	async login (ctx, next) {
		await ctx.render('login', {
		  title: 'Login'
		})
	}
	// Register Endpoints
	async register (ctx, next) {
		await ctx.render('register', {
		  title: 'Register'
		})
	}
} 

export default () => {
	return new Endpoint()
}