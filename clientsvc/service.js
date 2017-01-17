// Create an interface

// The Client interface
class ClientInterface {
  getClients () {
    throw new Error('ClientInterfaceError: getClients() is not implemented')
  }
  getClient () {
    throw new Error('ClientInterfaceError: getClient() is not implemented')
  }
  postClient () {
    throw new Error('ClientInterfaceError: postClient() is not implemented')
  }
  updateClient () {
    throw new Error('ClientInterfaceError: updateClient() is not implemented')
  }
  deleteClient () {
    throw new Error('ClientInterfaceError: deleteClient() is not implemented')
  }
}

// const ErrorUserNotFound = new Error('User not Found')

class ClientService extends ClientInterface {
  constructor (props) {
    super(props)
    this.db = props.db
  }
  getClients ({ limit = 10, skip = 0}) {
    return this.db.find({})
    .skip(skip)
    .limit(limit)
  }

  getClient ({ client_id }) {
    return this.db.findOne({ client_id })
  }

  getClientById ({ _id }) {
    return this.db.findOne({ _id })
  }

  async postClient ({ client_name, client_uri, logo_uri, policy_uri, redirect_uris }) {
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

    return client
  }

  // Requires authentication
  updateClient (_id, { client_name, client_uri, contacts, logo_uri, policy_uri, redirect_uris }) {
    console.log(_id, 'iddddd')
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
