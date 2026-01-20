## 2024-03-21 - Insecure Key Storage in SessionStorage

**Vulnerability:** Cryptographic keys (JWK format) are stored in `sessionStorage` in `App.jsx`.
**Learning:** The application relies on client-side storage for secrets, which is accessible via XSS. This was likely done for prototyping speed but compromises the encryption model.
**Prevention:** Use ephemeral keys, or derive keys from user passwords (PBKDF2) and never store the key material directly in persistent browser storage.
