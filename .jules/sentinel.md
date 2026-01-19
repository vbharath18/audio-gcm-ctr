## 2025-02-18 - Insecure Key Storage
**Vulnerability:** Cryptographic keys are stored in `sessionStorage` (specifically `currentKey` as JWK).
**Learning:** The app relies on `sessionStorage` to persist encryption state across page reloads (within the same tab). This exposes keys to XSS attacks.
**Prevention:** Keys should be kept in memory (closure/state) or stored in `IndexedDB` as non-extractable keys (if WebCrypto allows, or wrapped). Avoid `sessionStorage` for secrets.
