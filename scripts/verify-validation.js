import { validateAudioFile, MAX_FILE_SIZE } from '../src/utils/validation.js';

console.log('Running validation tests...');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// Test 1: Valid audio file
const validFile = {
  name: 'test.mp3',
  size: 1024 * 1024, // 1MB
  type: 'audio/mpeg'
};
const result1 = validateAudioFile(validFile);
assert(result1.valid === true, 'Valid file should pass');

// Test 2: File too large
const largeFile = {
  name: 'huge.wav',
  size: MAX_FILE_SIZE + 1,
  type: 'audio/wav'
};
const result2 = validateAudioFile(largeFile);
assert(result2.valid === false, 'Large file should fail');
assert(result2.error.includes('File size exceeds'), 'Error should mention size');

// Test 3: Invalid type
const imageFile = {
  name: 'image.png',
  size: 1024,
  type: 'image/png'
};
const result3 = validateAudioFile(imageFile);
assert(result3.valid === false, 'Image file should fail');
assert(result3.error.includes('Invalid file type'), 'Error should mention type');

// Test 4: Empty/No file
const result4 = validateAudioFile(null);
assert(result4.valid === false, 'Null file should fail');


console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);

if (failed > 0) process.exit(1);
