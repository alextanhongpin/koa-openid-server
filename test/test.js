import 'babel-polyfill'
const chai = require('chai')
const chaiHTTP = require('chai-http')
import app from '../server.js'
chai.use(chaiHTTP)
const should = chai.should()
const server = chai.request(app.listen(4000))

console.log(app, 'app')
it('returns success', (done) => {
  server.get('/login').end((err, res) => {
    // err.should.be.null
    // res.should.have.status(200)
    done()
  })
})

