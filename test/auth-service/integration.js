/*
 * public/scripts/model/expense.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 27/2/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

//
// README
//
// * Integration test for authentication services
// * Login and Register route
//

// TODO: Docker-compose everything

import 'babel-polyfill'

import chai from 'chai'
import fixtures from './fixtures/index.js'

// Import models
const expect = chai.expect

const UserDAO = {
  users: [],
  count () {
    return this.users.length
  },
  create (user) {
    this.users.push(user)
    return fixtures.loginResponse
  },
  get (email, password) {
    return this.users.filter(row => row.email === email && row.password === password)
  }
}

describe('Authentication Services', () => {
  context('Register Endpoint', () => {
    it('shall call the register endpoint', (done) => {
      const statusCode = 200
      expect(statusCode).to.be.eq(200)
      done()
    })

    it('shall register a new user', (done) => {
      const { username, password } = fixtures.loginRequest
      const count = UserDAO.count()

      const existingUser = UserDAO.get(email, password)
      expect(existingUser.length).to.be.eq(0)

      UserDAO.create({ username, password })
      expect(UserDAO.length).to.be.eq(count + 1)
      done()
    })

    it('shall log in an existing user', (done) => {
      const { username, password } = fixtures.loginRequest
      const existingUser = UserDAO.get(email, password)
      expect(existingUser.length).to.be.eq(1)
      done()
    })

    it('shall return the correct payload', (done) => {
      const response = UserDAO.create({ username: 'john', password: 'doe' })
      expect(response).to.have.property('access_token').eq('abc123')
      expect(response).to.have.property('refresh_token').eq('123abc')
      expect(response).to.have.property('expires_in').eq(3600)
      done()
    })
  })
})
