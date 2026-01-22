/* eslint-disable no-undef */
import { validateAudioFile } from '../src/utils/validation.js';

const runTest = (name, file, expectedValid) => {
    try {
        const result = validateAudioFile(file);
        if (result.valid === expectedValid) {
            console.log(`✅ ${name}: Passed`);
        } else {
            console.error(`❌ ${name}: Failed. Expected ${expectedValid}, got ${result.valid}. Error: ${result.error}`);
            process.exit(1);
        }
    } catch (e) {
        console.error(`❌ ${name}: Exception thrown`, e);
        process.exit(1);
    }
};

console.log("Running validation tests...");

// Valid case
runTest("Valid MP3", { name: "test.mp3", size: 1024, type: "audio/mpeg" }, true);
runTest("Valid WAV", { name: "test.wav", size: 500, type: "audio/wav" }, true);

// Invalid type
runTest("Invalid Type (Text)", { name: "test.txt", size: 1024, type: "text/plain" }, false);
runTest("Invalid Type (Image)", { name: "test.png", size: 1024, type: "image/png" }, false);

// Invalid size
const TOO_LARGE = (50 * 1024 * 1024) + 1;
runTest("File Too Large", { name: "big.wav", size: TOO_LARGE, type: "audio/wav" }, false);

// Null File
runTest("Null File", null, false);

console.log("All tests passed!");
