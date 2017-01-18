Example token revocation request hinting its type:

```
POST /token/revoke HTTP/1.1
Host: c2id.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

token=Ohw8choo.wii3ohCh.Eesh1AeDGong3eir&token_type_hint=refresh_token
```

Example token revocation request; the server will be let to determine the token type:

```
POST /token/revoke HTTP/1.1
Host: c2id.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

token=Ohw8choo.wii3ohCh.Eesh1AeDGong3eir
```
