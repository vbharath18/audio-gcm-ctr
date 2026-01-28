## 2025-02-19 - Insecure Key Storage in SessionStorage

**Vulnerability:** The application was storing sensitive encryption keys (exported as JWK) in `sessionStorage` (`currentKey`).
**Learning:** `sessionStorage` is vulnerable to Cross-Site Scripting (XSS). Any script running on the page can access it. Even for a demo, this establishes a bad pattern.
**Prevention:** Keys should be kept in ephemeral memory (e.g., React state variables) and never persisted to storage accessible by JavaScript unless encrypted with a user-derived key (which was not the case here). We moved the key to a React state variable `storedKey`.
