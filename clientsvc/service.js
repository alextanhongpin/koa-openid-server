// Create an interface
import ServiceInterface from '../common/service.js'

class ClientService extends ServiceInterface {

  async create ({ client_name, client_uri, logo_uri, policy_uri, redirect_uris }) {
    const Client = this.db
    const client = new Client()

    client.client_id = await Client.generateClientId(32)
    client.client_secret = await Client.generateClientSecret(32)
    client.grant_types = ['authorization_code', 'refresh_token']
    client.responses_types = ['code']
    client.client_name = client_name
    client.client_uri = client_uri
    client.logo_uri = logo_uri
    // client.tos_uri = tos_uri
    // client.policy_uri = policy_uri
    client.redirect_uris = redirect_uris

    await client.save()

    return client.toJSON()
  }
  // Requires authentication
  update (_id, { client_name, client_uri, contacts, logo_uri, policy_uri, redirect_uris }) {
    return this.db.findOneAndUpdate({ _id }, {
      $set: {
        contacts,
        client_name,
        client_uri,
        logo_uri,
        policy_uri,
        redirect_uris
      }
    }, {
      new: false // Do not create if it doesn't exist
    })
  }
}

// Export a new auth service
export default (options) => {
  return new ClientService(options)
}
