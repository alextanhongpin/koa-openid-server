// Setup mongoose

import mongoose, { connection } from 'mongoose'
mongoose.Promise = global.Promise

// In my opinion, you are trying to create another connection without closing the current one. So, you might want to use:
// createConnection() instead of connect().
const db = mongoose.createConnection(process.env.MONGO_URI)
// When using mongoose create connection
// you must use db.Model('MyModel') not mongoose.Model('MyModel') if you use createConnection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function () {
  console.log('connected to mongoose db')
})

export default db
