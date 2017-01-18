### 400 Bad Request

Invalid or denied request, see token error codes for more information.

Example:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error"             : "invalid_grant",
  "error_description" : "Bad request: Invalid or expired authorization code"
}```
