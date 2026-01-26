# Sentinel's Journal

This journal records CRITICAL security learnings, vulnerabilities found, and patterns established for this project.

## Format
`## YYYY-MM-DD - [Title]
**Vulnerability:** [What you found]
**Learning:** [Why it existed]
**Prevention:** [How to avoid next time]`

## 2026-01-26 - Insecure Key Storage in SessionStorage
**Vulnerability:** The application was storing AES encryption keys (exported as JWK) in `sessionStorage`. This exposed the keys to any script running on the same origin (XSS vulnerability), allowing attackers to decrypt sensitive user audio.
**Learning:** Convenience of persistence (reloading the page) often leads to insecurity. Developers might not realize `sessionStorage` is accessible to all JS on the page.
**Prevention:** Store sensitive cryptographic keys only in ephemeral application memory (e.g., React state or closures). If persistence is required, use `IndexedDB` with non-exportable keys (Web Crypto API `extractable: false`) or re-derive keys from a user password/passkey.
