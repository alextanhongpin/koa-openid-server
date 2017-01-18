### 403 Forbidden

The request was denied due to the bearer access token having insufficient privileges.

Example:
```
HTTP/1.1 403 Forbidden
WWW-Authenticate: Bearer error="insufficient_scope" error_description="Bearer access token has insufficient privileges"
```
