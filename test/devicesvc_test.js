// import 'babel-polyfill'
// import app from '../server.js'
// import chai from 'chai'
// import chaiHTTP from 'chai-http'
// import Device from '../devicesvc/model.js'

// chai.use(chaiHTTP)
// const should = chai.should()

// const server = () => {
//   return chai.request(app.listen())
// }

// describe('GET /devices', () => {
//   beforeEach((done) => {
//     Device.remove({}).then(() => done())
//   })

//   it('shall return status 200', (done) => {
//     server()
//     .post('/devices')
//     .send({
//       user_id: '537eed02ed345b2e039652d2'
//     })
//     .end((err, res) => {
//       server()
//       .get('/devices')
//       .end((err, res) => {
//         res.should.have.status(200)
//         res.body.should.be.instanceof(Array).and.have.lengthOf(1)
//         done()
//       })
//     })
//   })
// })

// describe('POST /devices', () => {
//   beforeEach((done) => {
//     Device.remove({}).then(() => done())
//   })
//   it('shall create a new device', (done) => {
//     server()
//     .post('/devices')
//     .send({
//       user_id: '537eed02ed345b2e039652d2'
//     })
//     .end((err, res) => {
//       res.should.have.status(200)
//       res.body.should.have.property('access_token')
//       res.body.should.have.property('refresh_token')
//       res.body.should.have.property('user_agent')
//       res.body.should.have.property('user_id')
//       done()
//     })
//   })

//   it('shall throw error when no user id is provided', (done) => {
//     server()
//     .post('/devices')
//     .send({
//       user_id: ''
//     })
//     .end((err, res) => {
//       res.should.have.status(500)
//       res.body.should.have.property('error')
//       // res.body.should.have.property('error_description')
//       done()
//     })
//   })
// })
