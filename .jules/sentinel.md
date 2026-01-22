## 2025-02-18 - Input Validation Architecture
**Vulnerability:** Missing input validation on file uploads allowed processing of arbitrary files and potential DoS via large files.
**Learning:** The project lacked a centralized validation utility. Adding `src/utils/validation.js` establishes a pattern for separating security logic from UI components.
**Prevention:** Always validate user input (size and type) before processing. Use shared utility functions for consistent enforcement.
