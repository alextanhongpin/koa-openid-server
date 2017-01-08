// Proof key for code exchange (PKCE)

// 1. Client generates a random string. This become the code_verifier.
// 2. Client SHA256 encrypts the random string, and base64 encodes the SHA256 hash. This becomes the code_challenge.
// 3. Client requests an authorization code through secure https/tls, passing with it the code_challenge and code_challenge_method (S256).
// 4. Client and malicious application receive and authorization code through a non-secure connection.
// 5. Client requests an access token through secure https/tls, passing the authorization code and the code_verifier.
// 6. Server compares the code_verifier to the code_challenge using the code_challenge_method (S256). If they match, it sends back the access token.


function createCodeVerifier() {  
  let chars = 'abcdef0987654321';
  let randStr = '';

  for(var i = 0; i < 43; i++) {
    randStr += chars[Math.floor(Math.random()*chars.length)];
  }

  return randStr;
}
private createCodeChallenge(str: string): string {  
  let sha = CryptoJS.SHA256(str);
  return sha.toString(CryptoJS.enc.Base64).replace(/=/g, '');
}

code_challenge_method: s256 for SHA256