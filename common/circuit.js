// common/circuit.js

import circuitBreaker from 'opossum'

const CIRCUIT_BREAKER_OPTIONS = {
  timeout: 10000,
  maxFailures: 5,
  resetTimeout: 30000
}

export default (service, params, options = CIRCUIT_BREAKER_OPTIONS) => {
  return circuitBreaker(service, options).fire(params)
}
