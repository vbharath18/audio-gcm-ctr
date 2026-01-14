export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validates if the file is a valid audio file within size limits.
 * @param {File} file - The file to validate.
 * @returns {{valid: boolean, error?: string}} - Validation result.
 */
export function validateAudioFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!file.type.startsWith('audio/')) {
    return {
      valid: false,
      error: 'Invalid file type. Only audio files are allowed.'
    };
  }

  return { valid: true };
}
