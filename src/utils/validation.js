export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const ALLOWED_MIME_PREFIX = 'audio/';

/**
 * Validates an uploaded file for security constraints.
 * @param {File} file - The file object to validate.
 * @returns {{ valid: boolean, error?: string }} - Result object.
 */
export function validateAudioFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check file size (DoS prevention)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`
    };
  }

  // Check file type (basic MIME check)
  // Note: This relies on the browser's MIME sniffing and user extension.
  // For higher security, magic bytes should be checked on the server (if applicable) or via FileReader.
  if (!file.type || !file.type.startsWith(ALLOWED_MIME_PREFIX)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only audio files are allowed.`
    };
  }

  // Sanitize filename for display (prevent simple control character injection in logs)
  // Although React escapes output, this is good practice.
  // We don't change the file name on the object, just validate it is not suspicious?
  // Actually, we just need to return valid here. The caller handles the file.

  return { valid: true };
}
