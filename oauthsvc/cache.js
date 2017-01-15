/* config/initializers/devise.rb

# Lock account based on failed login attempts
config.lock_strategy = :failed_attempts

# Lock and unlock based on email
config.unlock_keys = [ :email ]

# Email the user the unlock link
config.unlock_strategy = :email

# Lockout the account after 5 failed logins
config.maximum_attempts = 51

# Make sure devise has:lockable set in your model:

devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable, :lockable

FUNCTION LIMIT_API_CALL(key):
value = INCR(key)
IF value > 10 THEN
    ERROR "too many requests"
ELSE
    IF (PERFORM_API_CALL())
        DEL(key)
    ELSE
        EXPIRE(key, blockedTime)
END

If global_attempt_count is greater than 300 or
if ip_attempt_count is greater than 25 or
if ip_block_attempt_count is greater than 100 or
if username_attempt_count is greater than 5
reject the login.

*/

function lockLogin (cookie_id, ip, email) {
  client.incr(cookie_id)
  client.incr(ip)
  const ipAttemptCount = client.get(`login:${ip}`)
  const ipBlockAttemptCount = client.get(`login:block:${ip}`)
  const usernameAttemptCount = client.get(`login:email:${email}`)
}
function limitApiCall (access_token) {
  return new Promise((resolve, reject) => {
    const count = client.get(access_token)
    const isBlocked = client.get(`blocked:${access_token}`)
    if (isBlocked) {
      return reject(new Error('You are blocked from making this request. Please wait X minutes'))
    } else {
            // Don't store unnecessary data
      client.delete(`blocked:${access_token}`)
    }
    if (count > 10) {
      client.set(`blocked:${access_token}`, true)
            // Block for 15 minutes
      client.expire(`blocked:${access_token}`, 15 * 1000 * 60)
      client.delete(access_token)
      reject(new Error('429: Too many requests'))
    } else {
            // Throttled to 15 calls per second
      client.expire(access_token, 1000 / 15)
      resolve()
    }
  })
}
