config/initializers/devise.rb

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
