# Audio Crypto Recorder

A React-based web application that records audio in 1-second chunks, encrypts them using Web Crypto API (AES-GCM or AES-CTR), stores them in IndexedDB, and allows for decryption and playback. It also includes a benchmarking mode to compare encryption performance between the two algorithms.

## Features

- **Audio Recording**: Captures audio using the MediaRecorder API in 1-second slices.
- **Encryption**: Supports **AES-GCM** and **AES-CTR** encryption for audio chunks.
- **Storage**: Stores encrypted chunks and metadata in the browser's **IndexedDB** using the `idb` library.
- **Playback**: Decrypts stored chunks, reconstructs the audio blob, and plays it back.
- **Performance Metrics**: Measures and displays encryption/decryption times (total and per-chunk).
- **Comparison Mode**: Runs a side-by-side comparison of AES-GCM vs AES-CTR on the same recorded data.

## How to Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Development Server**
    ```bash
    npm run dev
    ```

3.  **Open the App**
    - The terminal will show the local URL (typically `http://localhost:5173`).
    - Open this URL in a modern browser (Chrome recommended for full IndexedDB/Audio support).

## Usage

1.  Click **Start Recording** to capture audio.
2.  Click **Stop Recording** when finished.
3.  Choose an encryption mode (AES-GCM or AES-CTR) and click **Encrypt & Store** to save the recording securely.
4.  Click **Decrypt & Play** to retrieve the data, decrypt it, and listen to the playback.
5.  Click **Compare Modes** to run a performance benchmark of both algorithms on the current recording.
6.  Click **Clear All** to reset the storage and state.
