// Service Interface with basic CRUD methods

export default class ServiceInterface {
  constructor (props) {
    this.db = props.db
  }
  create (props) {
    return this.db.create(props)
  }
  all ({query = {}, skip = 0, limit = 10}) {
    return this.db.find(query)
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
