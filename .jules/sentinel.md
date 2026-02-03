## 2025-02-18 - [Insecure Key Storage in SessionStorage]
**Vulnerability:** The application stored raw AES-256 encryption keys in `sessionStorage` (serialized as JWK). This exposed the keys to any Cross-Site Scripting (XSS) vulnerability, as `sessionStorage` is accessible to JavaScript running in the same origin.
**Learning:** The developers likely chose `sessionStorage` for convenience to persist the "session" across page reloads (in the same tab) without realizing that "ephemeral" storage in the browser is still vulnerable to read-access from malicious scripts. They also made the keys `extractable: true` to support this serialization.
**Prevention:**
1. Never store cryptographic keys in `localStorage` or `sessionStorage`.
2. Use in-memory storage (React state, variables) for sensitive keys when possible.
3. If persistence is needed, use IndexedDB with non-extractable keys (stored as `CryptoKey` objects, not raw bytes), or wrap keys with a KEK (Key Encryption Key) derived from a user password.
4. Always set `extractable: false` for keys generated via Web Crypto API unless export is strictly necessary.
