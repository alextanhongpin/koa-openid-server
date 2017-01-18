Example registration response:

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache

{
 "client_id"                    : "s6BhdRkqt3",
 "client_secret"                :"JBGuX8sIsPhL2aiHtdo_rb8JIMyTjHkLgfVB_zYf2NQ",
 "client_secret_expires_at"     : 1577858400,
 "registration_access_token"    : "SQvs1wv1NcAgsZomWWif0d9SDO0GKHYrUN6YR0ocmN0",
 "registration_client_uri"      : "https://c2id.com/client-reg/s6BhdRkqt3",
 "client_name"                  : "My Cool App",
 "logo_uri"                     : "https://client.example.org/logo.png",
 "application_type"             : "web",
 "grant_types"                  : [ "authorization_code" ],
 "response_types"               : [ "code" ],
 "redirect_uris"                : [ "https://client.example.org/callback" ],
 "token_endpoint_auth_method"   : "client_secret_basic",
 "id_token_signed_response_alg" : "RS256",
 "subject_type"                 : "public"
}
```

The following is a non-normative example registration response (with line wraps within values for display purposes only):
```
  HTTP/1.1 201 Created
  Content-Type: application/json
  Cache-Control: no-store
  Pragma: no-cache

  {
   "client_id": "s6BhdRkqt3",
   "client_secret":
     "ZJYCqe3GGRvdrudKyZS0XhGv_Z45DuKhCUk0gBR1vZk",
   "client_secret_expires_at": 1577858400,
   "registration_access_token":
     "this.is.an.access.token.value.ffx83",
   "registration_client_uri":
     "https://server.example.com/connect/register?client_id=s6BhdRkqt3",
   "token_endpoint_auth_method":
     "client_secret_basic",
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
   "jwks_uri": "https://client.example.org/my_public_keys.jwks",
   "userinfo_encrypted_response_alg": "RSA1_5",
   "userinfo_encrypted_response_enc": "A128CBC-HS256",
   "contacts": ["ve7jtb@example.org", "mary@example.org"],
   "request_uris":
     ["https://client.example.org/rf.txt
       #qpXaRLh_n93TTR9F252ValdatUQvQiJi5BDub2BeznA"]
  }
  ```