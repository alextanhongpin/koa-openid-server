const Service = {
  login (email, password) {
    const request = fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email, password
      })
    })

    const response = request.then((body) => {
      if (!body) {
        window.alert('Error parsing body')
        return
      }
      return body.json()
    }).catch((error) => {
      if (error) {
        window.alert(error)
      }
    })
    return response
  },
  register (email, password) {
    const request = fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email, password
      })
    })

    const response = request.then((body) => {
      if (!body) {
        window.alert('Error parsing body')
        return {}
      }
      return body.json()
    }).catch((error) => {
      if (error) {
        window.alert(error)
      }
    })

    return response
  },
  // Description: Calls the authenticate api when the page loads
  // to check if the user is authenticated or not
  //
  //    const accessToken = window.localStorage.accessToken
  //    const refreshToken = window.localStorage.refreshToken
  authenticate (accessToken, refreshToken) {
    return new Promise((resolve, reject) => {
      if (!accessToken || !refreshToken) {
        // Redirect the user to the login page
        // window.location.replace('/login')
        reject(new Error('User is not authenticated'))
      } else {
        const request = fetch('/userinfo', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${accessToken}`
          }
          // body: JSON.stringify({})
        })

        const response = request.then((body) => {
          if (!body) {
            return reject(new Error('Error parsing body'))
          } else {
            return body.json()
          }
        }).catch((error) => {
          reject(error)
        }).then((json) => {
          resolve(json)
        })
      }
    })
  },

  // Request for a new access token by providing a refresh token
  refresh ({accessToken, refreshToken}) {
    return new Promise((resolve, reject) => {
      console.log('Service.refresh:accessToken => ', accessToken)
      console.log('Service.refresh:refreshToken => ', refreshToken)

      if (!accessToken || !refreshToken) {
        // Redirect the user to the login page
        // window.location.replace('/login')
        reject(new Error('User is not authenticated'))
      } else {
        const request = fetch('/token/refresh', {
          method: 'POST',
          headers: {
            'Accept': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            refreshToken: refreshToken
          })
        })

        const response = request.then((body) => {
          if (!body) {
            return reject(new Error('Error parsing body'))
          } else {
            return body.json()
          }
        }).catch((error) => {
          reject(error)
        }).then((json) => {
          resolve(json)
        })
      }
    })
  },
  introspect ({ token, token_type_hint }) {
    const request = fetch('/client-introspect', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        token, token_type_hint
      })
    })

    const response = request.then((body) => {
      if (!body) {
        window.alert('Error parsing body')
        return
      }
      return body.json()
    }).catch((error) => {
      if (error) {
        window.alert(error)
      }
    })

    return response
  },

  authorize ({ access_token, client_id, redirect_uri, response_type, scope }) {
    const request = fetch('/authorize', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        client_id,
        redirect_uri,
        response_type,
        scope
      })
    })

    const response = request.then((body) => {
      if (!body) {
        return reject(new Error('Error parsing body'))
      } else {
        return body.json()
      }
    }).catch((error) => {
      console.log(error)
    })
    return response
  }
}
