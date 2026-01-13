## 2026-01-13 - Client-Side DoS Prevention via Input Validation
**Vulnerability:** The application allowed uploading arbitrarily large files, which were then processed in-memory (slicing and conversion to ArrayBuffer), potentially causing browser crashes (DoS).
**Learning:** Client-side input validation is crucial not just for server security but for preserving the stability of the user's browser session. Even without a backend, unchecked inputs can degrade the user experience.
**Prevention:** Implement strict size and type checks before processing any user-supplied files.
