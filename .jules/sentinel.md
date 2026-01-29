## 2026-01-29 - Insecure Key Storage in SessionStorage
**Vulnerability:** Cryptographic keys were exported and stored in `sessionStorage` to persist the session. This exposed the keys to XSS attacks, as any script running on the origin could access `sessionStorage`.
**Learning:** Convenience (persistence across reloads) often trades off with security. Storing sensitive keys in Web Storage APIs (localStorage/sessionStorage) is a common anti-pattern.
**Prevention:** Keep sensitive keys in ephemeral memory (e.g., React state/Context). If persistence is needed, use IndexedDB with non-exportable keys (Web Crypto API) if the architecture supports it, but for high security, avoid client-side persistence of raw key material.
