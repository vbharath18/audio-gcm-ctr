export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validates an audio file.
 * @param {File} file - The file to validate.
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateAudioFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  // Check if type is present and starts with audio/
  if (!file.type || !file.type.startsWith('audio/')) {
    return { isValid: false, error: 'Invalid file type. Please upload an audio file.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File size exceeds 50MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` };
  }

  return { isValid: true, error: null };
}
