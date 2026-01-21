/**
 * Validates an uploaded file.
 * Checks for audio MIME type and size limit (50MB).
 *
 * @param {File} file - The file to validate
 * @returns {object} - { valid: boolean, error: string | null }
 */
export function validateAudioFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check MIME type
  if (!file.type.startsWith('audio/')) {
    return { valid: false, error: 'Invalid file type. Please upload an audio file.' };
  }

  // Check size (50MB limit)
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File is too large. Maximum size is 50MB.' };
  }

  return { valid: true, error: null };
}
