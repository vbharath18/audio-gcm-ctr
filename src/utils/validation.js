export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validates an audio file for security and constraints.
 * @param {File} file - The file object to validate.
 * @returns {{valid: boolean, error?: string}} - Validation result.
 */
export function validateAudioFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check for audio MIME type
  // Note: client-side MIME check is easily bypassed, but prevents accidental uploads
  if (!file.type.startsWith('audio/')) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload an audio file.'
    };
  }

  // Check file size (DoS prevention)
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds limit (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB).`
    };
  }

  return { valid: true };
}
