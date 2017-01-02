// Setup mongoose

import mongoose, { connection } from 'mongoose'
mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI)

connection.on('error', console.error.bind(console, 'connection error:'))
connection.once('open', function () {
  console.log('connected to mongoose db')
})

export default mongoose
