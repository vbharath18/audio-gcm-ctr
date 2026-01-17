## 2024-05-22 - Insecure Key Storage in SessionStorage
**Vulnerability:** Cryptographic keys are stored in `sessionStorage` in `App.jsx`, exposing them to XSS attacks.
**Learning:** Hardcoding key persistence strategies in frontend components (even for prototypes) creates security debt that is easily copy-pasted into production.
**Prevention:** Use `IndexedDB` for non-exportable keys or keep keys in memory only. If persistence is needed, use `crypto.subtle.wrapKey` or similar mechanisms.
