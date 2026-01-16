export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validates an audio file for security constraints.
 * Checks file type (must be audio/*) and size (max 50MB).
 *
 * @param {File} file - The file object to validate
 * @returns {Object} result - { isValid: boolean, error: string | null }
 */
export function validateAudioFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check file type
  // Note: client-side MIME check is weak (can be spoofed), but serves as first line of defense
  if (!file.type.startsWith('audio/')) {
    return { isValid: false, error: 'Invalid file type. Only audio files are allowed.' };
  }

  // Check file size (DoS prevention)
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` };
  }

  return { isValid: true, error: null };
}
