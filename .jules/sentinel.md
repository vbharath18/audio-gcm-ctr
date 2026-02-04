## 2025-02-18 - Ephemeral Key Storage Pattern
**Vulnerability:** Cryptographic keys were stored in `sessionStorage` and marked as `extractable: true`, allowing potential XSS attackers to exfiltrate keys and decrypt sensitive user data.
**Learning:** The application required a way to access keys for decryption within a session. `sessionStorage` was chosen for convenience but compromised security. Moving to React state makes keys ephemeral (lost on reload) but significantly more secure as they can be kept non-extractable and in memory only.
**Prevention:** Use `useState` or a secure context to hold `CryptoKey` objects in memory. Ensure `extractable` is set to `false` during key generation. Accept ephemeral sessions as a security trade-off for high-value prototypes.
