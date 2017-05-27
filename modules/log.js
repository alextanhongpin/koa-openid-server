// debug allows you to debug the service independently

class Log {
  constructor (service) {
    this.service = service
  }
  debug (namespace, key, value) {
    console.log(`${this.service}:${namespace}:${key} => `, value)
  }
}

export default (service) => {
  return new Log(service)
}
