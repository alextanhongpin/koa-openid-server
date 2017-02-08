
class Base64 {
  // Converts a given string to base64
  encode (string) {
    return new Buffer(string).toString('base64')
  }

  // Converts base64 string to ascii string back
  decode (string) {
    return Buffer.from(base64, 'base64').toString('ascii')
  }
}

export default = () => {
  return new Base64()
}
