Here is an example HTTP request (taken from the Connect2id server API docs) to register a client application with the given redirection URI, name and logo URI:
```
POST /client-reg HTTP/1.1
Host: server.c2id.com
Authorization: Bearer ztucZS1ZyFKgh0tUEruUtiSTXhnexmd6
Content-Type: application/json

{
 "redirect_uris" : [ "https://client.example.org/callback" ],
 "client_name"   : "My Cool App",
 "logo_uri"      : "https://client.example.org/logo.png"
}
```

The following is a non-normative example registration request (with line wraps within values for display purposes only):
```
  POST /connect/register HTTP/1.1
  Content-Type: application/json
  Accept: application/json
  Host: server.example.com
  Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.eyJ ...

  {
   "application_type": "web",
   "redirect_uris":
     ["https://client.example.org/callback",
      "https://client.example.org/callback2"],
   "client_name": "My Example",
   "client_name#ja-Jpan-JP":
     "クライアント名",
   "logo_uri": "https://client.example.org/logo.png",
   "subject_type": "pairwise",
   "sector_identifier_uri":
     "https://other.example.net/file_of_redirect_uris.json",
   "token_endpoint_auth_method": "client_secret_basic",
   "jwks_uri": "https://client.example.org/my_public_keys.jwks",
   "userinfo_encrypted_response_alg": "RSA1_5",
   "userinfo_encrypted_response_enc": "A128CBC-HS256",
   "contacts": ["ve7jtb@example.org", "mary@example.org"],
   "request_uris":
     ["https://client.example.org/rf.txt
       #qpXaRLh_n93TTR9F252ValdatUQvQiJi5BDub2BeznA"]
  }```