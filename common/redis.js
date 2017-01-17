import redis from 'redis'

const client = redis.createClient()

client.monitor(function (err, res) {
  console.log('Redis entering monitoring mode.')
})

client.on('connect', function () {
  console.log('Redis is connected')
})

client.on('monitor', function (time, args, raw_reply) {
  console.log(time + ': ' + args) // 1458910076.446514:['set', 'foo', 'bar']
})

export default client
