## 2026-02-02 - Insecure Key Storage in SessionStorage
**Vulnerability:** Cryptographic keys were serialized and stored in `sessionStorage`, making them accessible to any script running on the page (XSS risk).
**Learning:** Developers often prioritize convenience (persistence across reloads) over security in prototypes, leading to dangerous patterns like storing sensitive keys in Web Storage APIs.
**Prevention:** Always store sensitive cryptographic material in memory (e.g., React state, closures) and avoid persistence. Use `extractable: false` for CryptoKeys to prevent export.
