## 2024-10-27 - Missing Input Validation Logic
**Vulnerability:** File upload validation (size and type) was completely missing from the codebase, despite external context suggesting it was implemented.
**Learning:** "Trust but verify" applies to codebase knowledge as well. Artifacts or memories describing the code may not match reality.
**Prevention:** Always audit the actual implementation of security controls (like input validation) before assuming they are active.
