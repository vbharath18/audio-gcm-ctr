## 2024-05-22 - [Secure Key Storage & Non-Extractable Keys]
**Vulnerability:** Cryptographic keys were generated with `extractable: true` and stored in `sessionStorage`.
**Learning:** `sessionStorage` is vulnerable to XSS attacks, allowing attackers to steal keys. Extractable keys can be exported and exfiltrated.
**Prevention:** Generate keys with `extractable: false` and store them in ephemeral memory (e.g., React state) instead of persistent storage like `sessionStorage` or `localStorage`.
