/*
 * Converts a given string to base64
**/
function encode (string) {
  return new Buffer(string).toString('base64')
}
/*
 * Converts base64 string to ascii string back
**/
function decode (base64) {
  return Buffer.from(base64, 'base64').toString('ascii')
}

export default { encode, decode }
