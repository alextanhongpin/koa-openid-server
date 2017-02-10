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

  // async getClientConnect (ctx, next) {
  //   await ctx.render('connect', {
  //     title: 'Connect'
  //   })
  // },
  // // POST /client-introspect
  // async postClientIntrospect (ctx, next) {
  //   // Fires a middleware sdk to introspect the token
  //   try {
  //     const response = await openIdSDK.introspect({
  //       token_type_hint: ctx.request.body.token_type_hint,
  //       token: ctx.request.body.token
  //     })
  //     // Success Response
  //     ctx.status = 200
  //     ctx.body = response
  //   } catch (err) {
  //     // Error response
  //     ctx.status = 200
  //     ctx.body = {
  //       active: false
  //     }
  //   }
  // },
  // async postClientRefreshToken (ctx, next) {
  //   try {
  //     const response = await openIdSDK.refresh({
  //       refresh_token: ctx.request.body.refreshToken,
  //       grant_type: 'refresh_token',
  //       scope: [],
  //       redirect_uri: 'something'
  //     })
  //     ctx.status = 200
  //     ctx.body = response
  //   } catch (err) {
  //     throw err
  //   }
  // },
  // // GET /client-authorize
  // // Description: When the client chooses to connect
  // // with the provided, the client will trigger an
  // // authorize() endpoint from their side which will
  // // call the authorizeSDK()
  // async getClientAuthorize (ctx, next) {
  //   const response = await openIdSDK.authorize()
  //   // The response will be a redirect url
  //   // to the provider consent screen
  //   ctx.redirect(response.authorize_uri)
  // },
  // // GET /client-authorize/callback
  // // Description: Once the client has accepted/rejected
  // // the connection with the Provider, the client
  // // will receive the success/error response
  // // at the callback url.
  // // The code received here will be traded with a valid access token
  // // and can only be used once
  // async getClientAuthorizeCallback (ctx, next) {
  //   try {
  //     const request = {
  //       code: ctx.query.code
  //     }
  //     // Should have a code
  //     // to be traded with an access token
  //     const response = await openIdSDK.authorizeCallback(request)
  //     // ctx.state.response = response
  //     ctx.status = 200
  //     ctx.body = response
  //     await next()
  //   } catch (err) {
  //     // handle error
  //     console.log(err)
  //   }
  // }
} 

export default () => {
	return new Endpoint()
}