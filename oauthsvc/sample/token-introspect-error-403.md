### 403 Forbidden

The request was denied due to the client registration or authorisation token not having the required scope.

Example:

```
HTTP/1.1 403 Forbidden

{
  "error"             : "access_denied",
  "error_description" : "Client not registered for https://c2id.com/token/introspect scope"
}```
