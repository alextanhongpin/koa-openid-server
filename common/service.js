// Service Interface with basic CRUD methods

export default class ServiceInterface {
  constructor (props) {
    this.db = props.db
  }
  create (props) {
    return this.db.create(props)
  }
  all ({skip = 0, limit = 10}) {
    const args = [...arguments]
    const validKeys = Object.keys(args).filter((d) => {
      return d !== 'skip' && d !== 'limit'
    })
    const validParams = validKeys.reduce((o, k) => {
      o[k] = arguments[k]
      return o
    }, {})
    return this.db.find(validParams)
    .skip(skip)
    .limit(limit)
  }
  one ({ id: _id }) {
    return this.db.findOne({ _id })
  }
  delete ({ id: _id }) {
    return this.db.remove({ _id })
  }
  update ({ id: _id, params }) {
    return this.db.update({ _id }, {
      $set: params
    }, {})
  }
}
