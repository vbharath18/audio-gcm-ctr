## 2025-02-18 - Insecure Client-Side Key Persistence
**Vulnerability:** Cryptographic keys (JWK format) are serialized and stored in `sessionStorage` to maintain user sessions across reloads.
**Learning:** The application attempts to provide persistence without a backend, forcing a trade-off where keys are exposed to XSS attacks. This is a fundamental architectural weakness in the current "local-only" design.
**Prevention:** Avoid storing raw key material in storage APIs accessible to JavaScript. Use `IndexedDB` with `extractable: false` keys, or require a user password to wrap/unwrap keys (Key wrapping).

## 2025-02-18 - Missing Input Validation
**Vulnerability:** File upload handlers processed files directly without validating size or type.
**Learning:** Client-side only apps often trust user input (files) implicitly because they originate from the user, but this exposes the browser to DoS (large files) or unexpected behaviors.
**Prevention:** Implement a central validation utility (`src/utils/validation.js`) to enforce size limits and type checks before processing any user input.
