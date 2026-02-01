# Sentinel's Journal

## 2026-02-01 - [Insecure Key Storage in SessionStorage]
**Vulnerability:** Encryption keys were generated as 'extractable' and stored in `sessionStorage` to allow session persistence.
**Learning:** Developers often prioritize convenience (persistence across reloads) over security (key isolation) in demo applications.
**Prevention:** Always set `extractable: false` for `CryptoKey` generation unless export is strictly required. Use ephemeral memory (React state) or secure storage mechanisms (not `sessionStorage` or `localStorage`) for sensitive key material.
