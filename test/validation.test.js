import assert from 'assert';
import { validateAudioFile } from '../src/utils/validation.js';

// Mock File object
class MockFile {
  constructor(size, type) {
    this.size = size;
    this.type = type;
  }
}

console.log('Running validation tests...');

// Test 1: Valid file
try {
  const validFile = new MockFile(1024, 'audio/mpeg');
  const result = validateAudioFile(validFile);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.error, null);
  console.log('✅ Valid file test passed');
} catch (e) {
  console.error('❌ Valid file test failed', e);
  throw e;
}

// Test 2: Invalid type
try {
  const invalidTypeFile = new MockFile(1024, 'image/png');
  const result = validateAudioFile(invalidTypeFile);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.error, 'Invalid file type. Please upload an audio file.');
  console.log('✅ Invalid type test passed');
} catch (e) {
  console.error('❌ Invalid type test failed', e);
  throw e;
}

// Test 3: File too large
try {
  const largeFile = new MockFile(50 * 1024 * 1024 + 1, 'audio/wav');
  const result = validateAudioFile(largeFile);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.error, 'File is too large. Maximum size is 50MB.');
  console.log('✅ Large file test passed');
} catch (e) {
  console.error('❌ Large file test failed', e);
  throw e;
}

// Test 4: No file
try {
  const result = validateAudioFile(null);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.error, 'No file selected.');
  console.log('✅ No file test passed');
} catch (e) {
  console.error('❌ No file test failed', e);
  throw e;
}

console.log('🎉 All tests passed!');
