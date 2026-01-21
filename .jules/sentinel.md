## 2024-05-22 - Insecure Key Storage in SessionStorage
**Vulnerability:** Cryptographic keys are exported to JWK format and stored in `sessionStorage` (along with session ID and algorithm) to maintain state across reloads.
**Learning:** Prototyping convenience often leads to insecure key persistence. Storing sensitive keys in web storage exposes them to XSS attacks.
**Prevention:** Keys should ideally be kept in memory or stored in IndexedDB as non-extractable `CryptoKey` objects, never exported to string format in insecure storage.
