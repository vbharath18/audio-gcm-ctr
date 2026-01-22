export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validates an audio file for security constraints.
 * @param {File} file - The file to validate.
 * @returns {Object} - { valid: boolean, error: string | null }
 */
export function validateAudioFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size (DoS prevention)
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }

  // Check MIME type
  // Note: verify strictly against audio/* pattern
  if (!file.type.startsWith('audio/')) {
    return {
      valid: false,
      error: 'Invalid file type. Only audio files are allowed.'
    };
  }

  return { valid: true, error: null };
}
