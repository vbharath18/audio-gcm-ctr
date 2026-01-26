# Audio Crypto Recorder

A React-based web application that demonstrates secure audio recording, encryption, and playback using the Web Crypto API. This project allows users to record audio or upload files, encrypt them using AES-GCM or AES-CTR algorithms, store them locally using IndexedDB, and perform performance comparisons between the two encryption modes.

## Features

- **Audio Recording**: Capture audio directly from the browser using the MediaStream Recording API.
- **File Upload**: Support for uploading existing audio files for encryption testing.
- **Client-Side Encryption**:
  - **AES-GCM**: Authenticated encryption mode (default).
  - **AES-CTR**: Counter mode encryption.
  - Uses 256-bit keys generated via the Web Crypto API.
- **Secure Storage**: Encrypted audio chunks are stored in the browser's IndexedDB. Keys are temporarily managed in ephemeral application state for the active session.
- **Performance Metrics**:
  - Measure encryption and decryption times.
  - Side-by-side comparison of AES-GCM vs. AES-CTR performance.
- **Playback**: On-the-fly decryption and playback of stored secure audio.

## Design & Architecture

The application is built with **React** and **Vite**, focusing on a component-based architecture with service separation for crypto and storage logic.

### Core Components

- **`src/App.jsx`**: The main controller component. It handles:
  - UI rendering and state management (recording status, logs, metrics).
  - Orchestrating the flow between recording, encryption, storage, and playback.
  - Managing the `MediaRecorder` lifecycle.

### Services

- **`src/services/crypto.js`**: A wrapper around the browser's `window.crypto.subtle` API.
  - `generateKey(algorithm)`: Generates AES-256 keys (extractable).
  - `encryptChunk(data, key, algorithm)`: Encrypts ArrayBuffers. Generates a unique IV (12 bytes for GCM, 16 bytes for CTR) for each operation.
  - `decryptChunk(...)`: Decrypts data using the stored IV/Counter.

- **`src/services/storage.js`**: Manages persistent local storage using **IndexedDB** (via the `idb` library).
  - Database: `audio-crypto-db`
  - Store: `chunks`
  - Data Structure: Stores encrypted blobs alongside metadata (session ID, chunk index, IV, algorithm).

### Data Flow

1.  **Capture**: Audio is captured in chunks (blobs) via `MediaRecorder` or file input.
2.  **Encryption**:
    - Blobs are converted to `ArrayBuffer`.
    - `crypto.js` encrypts each buffer individually.
    - Performance metrics (time taken) are captured.
3.  **Storage**: Encrypted chunks and their IVs are saved to IndexedDB. The encryption key is temporarily managed in ephemeral application state (memory) to allow immediate playback in the demo.
4.  **Decryption & Playback**:
    - Chunks are retrieved from IndexedDB.
    - `crypto.js` decrypts them using the session key.
    - Decrypted buffers are merged into a single Blob and played via an HTML5 Audio element.

## Installation & Running

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Steps

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the application**:
    Click the link provided in the terminal (usually `http://localhost:5173`).

### Building for Production

To create a production build:

```bash
npm run build
```

## Usage

1.  **Start Recording**: Click "Start Recording" to capture audio from your microphone. Click "Stop Recording" when finished.
2.  **Encryption Mode**: Select `AES-GCM` or `AES-CTR` from the dropdown.
3.  **Encrypt & Store**: Click to encrypt the recorded data and save it to the local database. You will see performance logs in the "Single Mode Results" section.
4.  **Decrypt & Play**: Recovers the data from the database, decrypts it, and plays the audio.
5.  **Compare Modes**: Click "Compare Modes (GCM vs CTR)" to run a benchmark on the current audio data using both algorithms and see a side-by-side performance table.
6.  **Clear All**: Resets the state and clears IndexedDB storage.
