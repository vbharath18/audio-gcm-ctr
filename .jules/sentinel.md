## 2024-05-21 - Insecure Key Storage in sessionStorage
**Vulnerability:** Cryptographic keys were exported and stored in `sessionStorage` to persist the session across reloads. This exposed the sensitive encryption keys to any XSS attack that could read `sessionStorage`.
**Learning:** `sessionStorage` is not a secure place for sensitive secrets like encryption keys because it is accessible to all scripts on the same origin.
**Prevention:** Keep sensitive keys in memory (e.g., React state) and do not persist them to storage unless they are encrypted with a user-provided password (which is not stored).
