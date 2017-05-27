import convict from 'convict'

const conf = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  service: {
    auth: {
      doc: 'Feature toggle for auth service',
      format: Boolean,
      default: true
    },
    device: {
      doc: 'Feature toggle for device service',
      format: Boolean,
      default: true
    },
    client: {
      doc: 'Feature toggle for client service',
      format: Boolean,
      default: true
    },
    oauth: {
      doc: 'Feature toggle for oauth service',
      format: Boolean,
      default: true
    }
  },
  route: {
    client: {
      doc: 'Feature toggle for client route',
      format: Boolean,
      default: true
    }
  }
})

conf.validate({ allowed: 'strict' })

export default conf
