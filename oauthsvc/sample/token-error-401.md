### 401 Unauthorized

The request was denied due to an invalid or missing client authentication, see token error codes for more information.

Example:

```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic
Content-Type: application/json

{
  "error"             : "invalid_client",
  "error_description" : "Missing client authentication"
}```
