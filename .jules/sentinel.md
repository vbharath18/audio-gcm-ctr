## 2026-01-31 - Ephemeral Key Storage & Non-Extractable Keys
**Vulnerability:** Cryptographic keys were stored in `sessionStorage` (accessible to any script on the page via XSS) and were marked as `extractable`, allowing an attacker to steal the key material.
**Learning:** Convenience of persistence (surviving page reloads) often leads to using insecure storage mechanisms like `sessionStorage` or `localStorage` for sensitive secrets.
**Prevention:** Store keys in ephemeral memory (React state/closures) and set `extractable: false` during key generation so the raw key material cannot be exported even if the application is compromised.
