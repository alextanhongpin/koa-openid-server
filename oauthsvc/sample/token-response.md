Example response with an access and ID token:
```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token" : "2YotnFZFEjr1zCsicMWpAA",
  "token_type"   : "bearer",
  "expires_in"   : 3600,
  "scope"        : "openid email profile app:read app:write",
  "id_token"     : "eyJraWQiOiIxZTlnZGs3IiwiYWxnIjoiUl..."
}```
