 Following is a non-normative example of an error response resulting
   from a redirect URI that has been blacklisted by the authorization
   server (with line wraps within values for display purposes only):

```
     HTTP/1.1 400 Bad Request
     Content-Type: application/json
     Cache-Control: no-store
     Pragma: no-cache

     {
      "error": "invalid_redirect_uri",
      "error_description": "The redirect URI http://sketchy.example.com
        is not allowed by this server."
     }
     ```

   Following is a non-normative example of an error response resulting
   from an inconsistent combination of "response_types" and
   "grant_types" values (with line wraps within values for display
   purposes only):
```
     HTTP/1.1 400 Bad Request
     Content-Type: application/json
     Cache-Control: no-store
     Pragma: no-cache

     {
      "error": "invalid_client_metadata",
      "error_description": "The grant type 'authorization_code' must be
        registered along with the response type 'code' but found only
       'implicit' instead."
     }
```