export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];

/**
 * Validates an audio file for size and type.
 * @param {File} file - The file to validate.
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateAudioFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File size exceeds 50MB limit.` };
  }

  // Check for generic audio/* type or specific allowed types
  if (!file.type.startsWith('audio/') && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Please upload an audio file.' };
  }

  return { isValid: true, error: null };
}
