import 'babel-polyfill'
import app from '../server.js'
import chai from 'chai'
import chaiHTTP from 'chai-http'
import Client from '../clientsvc/model.js'
import ClientSchema from '../clientsvc/schema.js'

chai.use(chaiHTTP)
const should = chai.should()

const server = () => {
  return chai.request(app.listen())
}

describe('Client Schema', () => {
  context('postClientRequest', () => {
    it('shall return the required params', (done) => {
      const request = ClientSchema.postClientRequest({
        client_name: 'Testing'
      })
      expect(request).to.be.true
      done()
    })

    // Test required field
    it('shall throw error if client_name is not provided', (done) => {
      const request = ClientSchema.postClientRequest({
        client_name: ''
      })
      expect(request).to.be.false
      // Test error message
      expect(error).to.be.eql('Invalid request')
      done()
    })

    it('shall not accept additional fields')
    it('shall not allow scripts')
  })

  context('postClientResponse', () => {
    it('shall not return additional fields')
  })
})

describe('Client Service', () => {
  beforeEach((done) => {
    Client.remove({}).then(() => done())
  })

  context('GET /clients', () => {
    it('shall respond with status 200', (done) => {
      server()
      .get('/api/v1/clients')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.instanceof(Array)
        done()
      })
    })
  })

  context('POST /clients', () => {
    it('shall create a new client', (done) => {
      server()
      .post('/api/v1/clients')
      .send({
        clientName: 'Testing',
        clientURI: 'http://www.test.com',
        logoURI: 'http://www.test.com/logo.png',
        contacts: ['test@mail.com'],
        tosURI: 'http://www.test.com/tos',
        policyURI: 'http://www.test.com/policy',
        redirectURIs: ['http://www.test.com/callback']
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('client_id')
        res.body.should.have.property('client_secret')
        // res.body.should.have.property('client_id_issued_at')
        // res.body.should.have.property('client_secret_expires_at').equal(0)
        res.body.should.have.property('redirect_uris')
        res.body.redirect_uris.should.be.instanceof(Array).deep.equal(['http://www.test.com/callback'])
        res.body.should.have.property('responses_types')
        res.body.responses_types.should.be.instanceof(Array).deep.equal(['code'])
        res.body.should.have.property('grant_types')
        res.body.should.have.property('client_name').equal('Testing')
        // res.body.should.have.property('token_endpoint_auth_method')
        res.body.should.have.property('logo_uri').equal('http://www.test.com/logo.png')
        done()
      })
    })
  })
})

// a) list of API URLs to test,
// b) list of all params required in JSON request
// c) list of mandatory params in JSON request
// d) list of error/success codes and messages
// 2. for automation testing, a framework that has these functionalities
// a) it makes a cURL call for an API
// b) validation on error codes and messages
// c) writes Pass/Fail on a text or excel file
// d) read input values for params in API requests from text or excel file
// 3. for performance testing using Siege Home or Apache JMeter - Apache JMeter™
// a) how many concurrent connections server can take before it fails
// b) concurrent loads in batches like 25, 100, 200, 500 and so on
// c) expected response time for all user loads
// d) expected throughput for all user loads
// e) expected qps - queries per second
