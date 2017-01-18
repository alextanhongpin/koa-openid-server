### 400 Bad Request

Invalid or malformed request.

Example:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error"             : "invalid_request",
  "error_description" : "Bad request: Invalid JSON: Unexpected token foo at position 3."
}
```
