import 'babel-polyfill'

import chai from 'chai'
import ClientModel from '../../clientsvc/model.js'

// Import models
const expect = chai.expect

describe('ClientModel', () => {
  context('statics.generateClientId()', () => {
    it('shall return a new client id when size is provided', (done) => {
      ClientModel.generateClientId(32).then((clientId) => {
        expect(clientId).to.be.string
        expect(clientId).not.to.be.null
        done()
      })
    })
    it('shall return a new client id when no size is provided', (done) => {
      ClientModel.generateClientId().then((clientId) => {
        expect(clientId).to.be.string
        expect(clientId).not.to.be.null
        done()
      })
    })

    it('shall not return a new client id when size equal 0 is provided', (done) => {
      ClientModel.generateClientId(0).then((clientId) => {
        expect(clientId).to.be.string
        expect(clientId).not.to.be.null
        done()
      })
    })

    it('shall not return a new client id when size smaller than 0 is provided', (done) => {
      ClientModel.generateClientId(-1).catch((err) => {
        expect(err).to.have.property('message').deep.eql('size must be a number >= 0')
        done()
      })
    })
  })

  context('statics.generateClientSecret()', () => {
    it('shall return a new client secret when size is provided', (done) => {
      ClientModel.generateClientSecret(32).then((clientId) => {
        expect(clientId).to.be.string
        expect(clientId).not.to.be.null
        done()
      })
    })
    it('shall return a new client secret when no size is provided', (done) => {
      ClientModel.generateClientSecret().then((clientId) => {
        expect(clientId).to.be.string
        expect(clientId).not.to.be.null
        done()
      })
    })

    it('shall not return a new client secret when size equal 0 is provided', (done) => {
      ClientModel.generateClientSecret(0).then((clientId) => {
        expect(clientId).to.be.string
        expect(clientId).not.to.be.null
        done()
      })
    })

    it('shall not return a new client secret when size smaller than 0 is provided', (done) => {
      ClientModel.generateClientSecret(-1).catch((err) => {
        expect(err).to.have.property('message').deep.eql('size must be a number >= 0')
        done()
      })
    })
  })
})

