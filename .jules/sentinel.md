# Sentinel Journal

## 2026-01-27 - SessionStorage Key Exposure
**Vulnerability:** Cryptographic keys were exported as JWK and stored in `sessionStorage`, making them accessible to any XSS attack.
**Learning:** Convenience of persistence (surviving page reloads) often leads to insecure storage choices like `localStorage` or `sessionStorage` for sensitive secrets.
**Prevention:** Store keys in ephemeral memory (React state) only. If persistence is required, use encrypted storage (e.g. wrapping keys with a KEK derived from a user password) or HTTP-only cookies for session management (server-side).
