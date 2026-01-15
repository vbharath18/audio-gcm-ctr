import { validateAudioFile } from '../src/utils/validation.js';

console.log('Running validation verification...');

const mockFileValid = {
  name: 'song.mp3',
  type: 'audio/mpeg',
  size: 5 * 1024 * 1024 // 5MB
};

const mockFileTooLarge = {
  name: 'podcast.wav',
  type: 'audio/wav',
  size: 51 * 1024 * 1024 // 51MB
};

const mockFileWrongType = {
  name: 'image.png',
  type: 'image/png',
  size: 2 * 1024 * 1024 // 2MB
};

const mockFileNoType = {
    name: 'unknown',
    type: '',
    size: 1024
};

// Test 1: Valid file
const result1 = validateAudioFile(mockFileValid);
if (result1.isValid) {
  console.log('✅ Test 1 Passed: Valid file accepted.');
} else {
  console.error('❌ Test 1 Failed: Valid file rejected.', result1.error);
  process.exit(1);
}

// Test 2: Too large file
const result2 = validateAudioFile(mockFileTooLarge);
if (!result2.isValid && result2.error.includes('exceeds 50MB')) {
  console.log('✅ Test 2 Passed: Large file rejected correctly.');
} else {
  console.error('❌ Test 2 Failed: Large file not rejected correctly.', result2);
  process.exit(1);
}

// Test 3: Wrong type
const result3 = validateAudioFile(mockFileWrongType);
if (!result3.isValid && result3.error.includes('Invalid file type')) {
  console.log('✅ Test 3 Passed: Wrong type rejected correctly.');
} else {
  console.error('❌ Test 3 Failed: Wrong type not rejected correctly.', result3);
  process.exit(1);
}

// Test 4: No type
const result4 = validateAudioFile(mockFileNoType);
if (!result4.isValid && result4.error.includes('Invalid file type')) {
    console.log('✅ Test 4 Passed: No type rejected correctly.');
} else {
    console.error('❌ Test 4 Failed: No type not rejected correctly.', result4);
    process.exit(1);
}

console.log('🎉 All verification tests passed!');
