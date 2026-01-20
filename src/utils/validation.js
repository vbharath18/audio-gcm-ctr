
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validates an uploaded audio file.
 * @param {File} file - The file to validate.
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateAudioFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  // Check file type
  if (!file.type.startsWith('audio/')) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.type}. Please upload an audio file.`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Limit is 50MB.`
    };
  }

  return { isValid: true, error: null };
}
