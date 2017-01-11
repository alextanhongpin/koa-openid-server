const Service = {
  login (email, password) {
    const request = fetch('/login', {
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
    }).catch((err) => {
      if (err) {
        window.alert(err)
      }
    })
    return response
  },
  register (email, password) {
    const request = fetch('/register', {
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
    }).catch((err) => {
      if (err) {
        window.alert(err)
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
        }).catch((err) => {
          reject(err)
        }).then((json) => {
          resolve(json)
        })
      }
    })
  },
  refresh ({accessToken, refreshToken}) {
    return new Promise((resolve, reject) => {
      if (!accessToken || !refreshToken) {
        // Redirect the user to the login page
        // window.location.replace('/login')
        reject(new Error('User is not authenticated'))
      } else {
        const request = fetch('/client-refresh', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
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
        }).catch((err) => {
          reject(err)
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
    }).catch((err) => {
      if (err) {
        window.alert(err)
      }
    })

    return response
  }
}
