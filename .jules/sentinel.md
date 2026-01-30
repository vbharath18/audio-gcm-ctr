## 2025-02-18 - Insecure Key Storage in SessionStorage
**Vulnerability:** Cryptographic keys were stored in `sessionStorage` to persist across reloads.
**Learning:** Developers might prioritize convenience (persisting session) over security (key exposure via XSS).
**Prevention:** Use ephemeral React state or robust state management for sensitive keys; ensure keys are cleared on session end.
