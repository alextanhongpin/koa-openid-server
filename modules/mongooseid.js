// mongooseid.js
// Description: A utility to validate if the mongoose id is valid

import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

// new ObjectId('timtamtomted'); //616273656e6365576f726b73
// new ObjectId('537eed02ed345b2e039652d2') //537eed02ed345b2e039652d2
export default (id) => {
  return new ObjectId(id) === id
}
