## 2025-02-18 - Key Storage Vulnerability
**Vulnerability:** Cryptographic keys were stored in `sessionStorage` in serialized JWK format.
**Learning:** Browser storage (localStorage/sessionStorage) is accessible to any JavaScript running on the origin, making it vulnerable to XSS attacks.
**Prevention:** Store sensitive cryptographic material only in ephemeral memory (e.g., React State or closures) and never persist it to storage without wrapping/encryption.
