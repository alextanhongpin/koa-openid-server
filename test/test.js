import 'babel-polyfill'
const chai = require('chai')
const chaiHTTP = require('chai-http')
const app = require('../server.js')
chai.use(chaiHTTP)
const should = chai.should()
const server = chai.request(app.default.listen(3000))

console.log(app, 'app')
it('returns success', (done) => {
  server.get('/').end((err, res) => {
    err.should.be.null
    res.should.have.status(200)
  })
})

