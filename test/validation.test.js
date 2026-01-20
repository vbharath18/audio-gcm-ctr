import { validateAudioFile, MAX_FILE_SIZE } from '../src/utils/validation.js';

// Helper to run tests
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Test failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('Running validation tests...');

// Test 1: Valid audio file
{
  const file = { name: 'test.mp3', size: 1024, type: 'audio/mpeg' };
  const result = validateAudioFile(file);
  assert(result.isValid === true, 'Valid audio file should pass');
  assert(result.error === null, 'Valid audio file should have no error');
}

// Test 2: Invalid type
{
  const file = { name: 'test.exe', size: 1024, type: 'application/x-msdownload' };
  const result = validateAudioFile(file);
  assert(result.isValid === false, 'Invalid type should fail');
  assert(result.error.includes('Invalid file type'), 'Should report invalid type');
}

// Test 3: Too large
{
  const file = { name: 'huge.wav', size: MAX_FILE_SIZE + 1, type: 'audio/wav' };
  const result = validateAudioFile(file);
  assert(result.isValid === false, 'Oversized file should fail');
  assert(result.error.includes('File too large'), 'Should report size limit');
}

// Test 4: Null file
{
  const result = validateAudioFile(null);
  assert(result.isValid === false, 'Null file should fail');
  assert(result.error === 'No file selected.', 'Should report no file');
}

console.log('All tests passed!');
