import 'babel-polyfill'
import app from '../server.js'
import chai from 'chai'
import chaiHTTP from 'chai-http'
import Client from '../clientsvc/model.js'

chai.use(chaiHTTP)
const should = chai.should()

const server = () => {
  return chai.request(app.listen())
}

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
