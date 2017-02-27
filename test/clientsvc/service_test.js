import 'babel-polyfill'

import chai from 'chai'
import ClientService from '../../clientsvc/service.js'
import ClientModel from '../../clientsvc/model.js'
import getClientRequest from '../../clientsvc/sample/get-client-request.json'
import getClientResponse from '../../clientsvc/sample/get-client-response.json'

// Import models
const expect = chai.expect

describe('ClientService', () => {
  context('constructor()', () => {
    it ('shall create a new client service', (done) => {
      const clientService = new ClientService({
        db: ClientModel
      })
      expect(clientService).to.have.property('db')
      expect(clientService).to.be.instanceOf(ClientService)
    }))
  })

  context('.getClients()', () => {
    it ('shall get a list of clients with default request', (done) => {
      const clientService = new ClientService({
        db: ClientModel
      })
      clientService.getClients().then((data) => {
        // expect(data).to.be.instanceOf.array
        // expect(data).to.be.eql.maxLength(10)
        done()
      })
    })

    it ('shall get max 20 clients with limit 20')
    it ('shall throw error if limit is less or equal to 0')
    it ('shall throw error if limit is more than 100')
    it ('shall skip additional fields')
  })

  context('.getClient()', () => {
    it ('shall get a client by client_id')
    it ('shall throw error if client_id is invalid')
    it ('shall throw error if client_id is null')
    it ('shall throw error if client_id is empty string')
    it ('shall throw error if client_id is white spaces')
  })

  context('.getClientById()', () => {
    it ('shall get a client by the _id')
  })

  context('.postClient()', () => {
    it ('shall update a client')
  })

  context('.updateClient()', () => {
    it ('shall not update if the request is empty')
    it ('shall skip additional fields')
    it ('shall not update if the field is empty string')
    it ('shall not update if the field is not provided')
  })
})