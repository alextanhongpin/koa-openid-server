The request is formed by taking the authorisation endpoint URL and appending the required parameters to it as query parameters.

For example:

```
https://c2id.com/login?
 response_type=code
 &scope=openid%20email
 &client_id=123
 &state=af0ifjsldkj
 &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```
