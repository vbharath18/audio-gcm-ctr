## 2026-01-24 - Insecure Key Storage in SessionStorage
**Vulnerability:** Cryptographic keys were serialized (JWK) and stored in `sessionStorage` to facilitate playback across page reloads. This exposed the keys to XSS attacks, as any script on the origin could access `sessionStorage`.
**Learning:** Convenience features (like preserving session across reloads) often lead to security compromises. `sessionStorage` is not a secure vault for secrets.
**Prevention:** Store sensitive cryptographic keys only in ephemeral memory (e.g., React component state or closures). Avoid serializing keys to any storage mechanism accessible to JavaScript (localStorage, sessionStorage, cookies) without wrapping encryption.
