import 'babel-polyfill'

import chai from 'chai'
import ClientSchema from '../../clientsvc/schema.js'
import getClientRequest from '../../clientsvc/sample/get-client-request.json'
import getClientResponse from '../../clientsvc/sample/get-client-response.json'

// Import models
const expect = chai.expect

describe('ClientSchema', () => {
  context('.getClientRequest()', () => {
    it('shall respond with success if request is valid', (done) => {
      const request = ClientSchema.getClientRequest(getClientRequest)
      expect(request).to.have.property('_id')
      done()
    })

    it('shall respond with error if request is null', (done) => {
      try {
        const request = ClientSchema.getClientRequest(null)
      } catch (err) {
        expect(err).to.have.property('message').eql('Invalid Request')
        expect(err).to.have.property('description')
        done()
      }
    })

    it('shall respond with error if request is empty object', (done) => {
      try {
        const request = ClientSchema.getClientRequest({})
        done()
      } catch (err) {
        expect(err).to.have.property('message').eql('Invalid Request')
        expect(err).to.have.property('description')
        done()
      }
    })

    it('shall respond with error if request required field is missing', (done) => {
      try {
        const request = ClientSchema.getClientRequest({car: ''})
      } catch (err) {
        expect(err).to.have.property('message').eql('Invalid Request')
        expect(err).to.have.property('description').deep.eql('should have required property \'_id\'')
        done()
      }
    })

    it('shall respond with error if request is empty string', (done) => {
      try {
        const request = ClientSchema.getClientRequest({_id: ''})
      } catch (err) {
        expect(err).to.have.property('message').eql('Invalid Request')
        expect(err).to.have.property('description')
        done()
      }
    })

    it('shall respond with success if request is empty spaces', (done) => {
        // NOTE: Carry out trimming in the service.
        // Ajv does not handle text trimming
      const request = ClientSchema.getClientRequest({_id: ' '})
      done()
    })

    it('shall respond with error if request is additional', (done) => {
      const request = ClientSchema.getClientRequest({_id: 'something', car: ''})
      expect(request).to.have.property('_id').eql('something')
      expect(request).not.to.have.property('car')
      done()
    })
  })

  context('.getClientResponse()', () => {
    it('shall respond with success if request is valid', (done) => {
      try {
        const response = ClientSchema.getClientResponse(getClientResponse)
        expect(response).to.have.property('client_id').eql(getClientResponse.client_id)
        expect(response).to.have.property('client_secret')
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})

