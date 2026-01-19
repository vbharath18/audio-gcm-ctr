import { validateAudioFile, MAX_FILE_SIZE } from '../src/utils/validation.js';
import assert from 'assert';

console.log('Running validation tests...');

try {
  // Test 1: Valid audio file
  {
    const file = { type: 'audio/mp3', size: 1024 * 1024 };
    const result = validateAudioFile(file);
    assert.strictEqual(result.valid, true, 'Valid file should pass');
    console.log('✅ Test 1 passed: Valid audio file');
  }

  // Test 2: Invalid type
  {
    const file = { type: 'image/png', size: 1024 };
    const result = validateAudioFile(file);
    assert.strictEqual(result.valid, false, 'Invalid type should fail');
    assert.match(result.error, /Invalid file type/, 'Error message should match');
    console.log('✅ Test 2 passed: Invalid type');
  }

  // Test 3: Too large
  {
    const file = { type: 'audio/wav', size: MAX_FILE_SIZE + 1 };
    const result = validateAudioFile(file);
    assert.strictEqual(result.valid, false, 'Too large file should fail');
    assert.match(result.error, /File size exceeds limit/, 'Error message should match');
    console.log('✅ Test 3 passed: File too large');
  }

  // Test 4: Edge case size (exact limit)
  {
    const file = { type: 'audio/wav', size: MAX_FILE_SIZE };
    const result = validateAudioFile(file);
    assert.strictEqual(result.valid, true, 'Exact limit size should pass');
    console.log('✅ Test 4 passed: Exact size limit');
  }

  // Test 5: No file
  {
    const result = validateAudioFile(null);
    assert.strictEqual(result.valid, false, 'Null file should fail');
    console.log('✅ Test 5 passed: No file');
  }

  // Test 6: Empty type
  {
      const file = { type: '', size: 100 };
      const result = validateAudioFile(file);
      assert.strictEqual(result.valid, false, 'Empty type should fail');
      console.log('✅ Test 6 passed: Empty type');
  }

  console.log('All tests passed!');
} catch (error) {
  console.error('❌ Test failed:', error);
  throw error;
}
