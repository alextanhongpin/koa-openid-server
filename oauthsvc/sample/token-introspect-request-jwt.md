Example token introspection request using client secret JWT authentication:

```
POST /token/introspect HTTP/1.1
Host: c2id.com
Content-Type: application/x-www-form-urlencoded

token=45ghiukldjahdnhzdauz&
 client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer&
 client_assertion=eyJhbGciOiJSUzI1NiIsImtpZCI6IjIyIn0.eyJpc3Mi...
```
