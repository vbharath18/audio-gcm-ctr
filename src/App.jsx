import { useState, useRef } from 'react';
import './App.css';
import { ALGORITHMS, generateKey, encryptChunk, decryptChunk } from './services/crypto';
import { storeChunk, getChunks, clearStorage } from './services/storage';
import { validateAudioFile } from './utils/validation';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]); // Raw blobs from current recording
  const [duration, setDuration] = useState(0);
  const [logs, setLogs] = useState([]);
  const [encryptionMode, setEncryptionMode] = useState(ALGORITHMS.GCM);
  const [metrics, setMetrics] = useState(null);
  const [decryptionMetrics, setDecryptionMetrics] = useState(null);
  const [comparisonMetrics, setComparisonMetrics] = useState(null);

  const mediaRecorderRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const localChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          localChunks.push(event.data);
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        clearInterval(timerIntervalRef.current);
        addLog(`Recording stopped. ${localChunks.length} chunks captured.`);
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setRecordedChunks([]);
      setDuration(0);
      setMetrics(null);
      setDecryptionMetrics(null);
      setComparisonMetrics(null);
      startTimeRef.current = Date.now();

      timerIntervalRef.current = setInterval(() => {
        setDuration((Date.now() - startTimeRef.current) / 1000);
      }, 100);

      addLog('Recording started...');

    } catch (err) {
      console.error("Error accessing microphone:", err);
      addLog(`Error: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const measureEncryption = async (buffers, mode) => {
      const key = await generateKey(mode);
      let totalTime = 0;
      const encryptedData = [];

      for (const buffer of buffers) {
          const t0 = performance.now();
          const result = await encryptChunk(buffer, key, mode);
          const t1 = performance.now();
          totalTime += (t1 - t0);
          encryptedData.push({ data: result.data, iv: result.iv, key }); // Keep key for decryption measurement if needed
      }
      return { totalTime, encryptedData };
  };

  const measureDecryption = async (encryptedChunks, mode) => {
      let totalTime = 0;
      for (const chunk of encryptedChunks) {
          const t0 = performance.now();
          await decryptChunk(chunk.data, chunk.iv, chunk.key, mode);
          const t1 = performance.now();
          totalTime += (t1 - t0);
      }
      return totalTime;
  }

  const encryptAndStore = async () => {
    if (recordedChunks.length === 0) {
      alert("No recording to store!");
      return;
    }

    addLog(`Starting encryption (${encryptionMode}) & storage...`);
    const sessionId = Date.now().toString();
    const buffers = await Promise.all(recordedChunks.map(blob => blob.arrayBuffer()));

    // Measure and encrypt
    const { totalTime, encryptedData } = await measureEncryption(buffers, encryptionMode);

    // Store in IDB
    await clearStorage();
    for (let i = 0; i < encryptedData.length; i++) {
        const chunk = encryptedData[i];
        await storeChunk(sessionId, i, chunk.data, chunk.iv, encryptionMode);
    }

    // Store key for decryption
    // Note: In a real app we wouldn't store key with data so casually, but for prototype:
    // We are grabbing the key from the first chunk as they are all encrypted with same key in this loop
    const key = encryptedData[0].key;
    const jwkKey = await window.crypto.subtle.exportKey('jwk', key);
    sessionStorage.setItem('currentKey', JSON.stringify(jwkKey));
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('algorithm', encryptionMode);

    setMetrics({
        encryptionTime: totalTime,
        chunkCount: buffers.length
    });

    addLog(`Stored ${buffers.length} encrypted chunks.`);
    addLog(`Total encryption time: ${totalTime.toFixed(2)}ms`);
  };

  const decryptAndPlay = async () => {
      const sessionId = sessionStorage.getItem('sessionId');
      const keyStr = sessionStorage.getItem('currentKey');
      const algorithm = sessionStorage.getItem('algorithm');

      if (!sessionId || !keyStr || !algorithm) {
          addLog("No stored session found.");
          return;
      }

      addLog(`Retrieving and decrypting (${algorithm})...`);

      const keyData = JSON.parse(keyStr);
      const key = await window.crypto.subtle.importKey(
          'jwk',
          keyData,
          { name: algorithm, length: 256 },
          true,
          ['encrypt', 'decrypt']
      );

      const storedChunks = await getChunks(sessionId);
      if (storedChunks.length === 0) {
          addLog("No chunks found in storage.");
          return;
      }

      let totalDecryptTime = 0;
      const decryptedBuffers = [];

      for (const chunk of storedChunks) {
          const t0 = performance.now();
          const decrypted = await decryptChunk(chunk.data, chunk.iv, key, algorithm);
          const t1 = performance.now();
          totalDecryptTime += (t1 - t0);
          decryptedBuffers.push(decrypted);
      }

      setDecryptionMetrics({
          decryptionTime: totalDecryptTime,
          chunkCount: decryptedBuffers.length
      });

      addLog(`Decryption complete. Time: ${totalDecryptTime.toFixed(2)}ms`);

      const blob = new Blob(decryptedBuffers, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      addLog("Playing audio...");
  };

  const runComparison = async () => {
      if (recordedChunks.length === 0) {
          alert("No recording to compare!");
          return;
      }

      addLog("Running comparison mode...");
      const buffers = await Promise.all(recordedChunks.map(blob => blob.arrayBuffer()));

      // GCM
      const gcmEnc = await measureEncryption(buffers, ALGORITHMS.GCM);
      const gcmDec = await measureDecryption(gcmEnc.encryptedData, ALGORITHMS.GCM);

      // CTR
      const ctrEnc = await measureEncryption(buffers, ALGORITHMS.CTR);
      const ctrDec = await measureDecryption(ctrEnc.encryptedData, ALGORITHMS.CTR);

      setComparisonMetrics({
          gcm: { enc: gcmEnc.totalTime, dec: gcmDec },
          ctr: { enc: ctrEnc.totalTime, dec: ctrDec },
          chunkCount: buffers.length
      });

      addLog("Comparison complete.");
  };

  const clearData = async () => {
      await clearStorage();
      sessionStorage.clear();
      setMetrics(null);
      setDecryptionMetrics(null);
      setComparisonMetrics(null);
      setRecordedChunks([]);
      addLog("Storage and state cleared.");
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const { valid, error } = validateAudioFile(file);
    if (!valid) {
      addLog(`Error: ${error}`);
      alert(error);
      event.target.value = ''; // Reset input
      return;
    }

    addLog(`File selected: ${file.name} (${file.size} bytes)`);

    const chunkSize = 128 * 1024; // 128KB
    const chunks = [];
    let offset = 0;

    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      chunks.push(chunk);
      offset += chunkSize;
    }

    setRecordedChunks(chunks);
    setDuration(0); // We don't know the duration easily without decoding
    setMetrics(null);
    setDecryptionMetrics(null);
    setComparisonMetrics(null);
    addLog(`File loaded and split into ${chunks.length} chunks.`);
  };

  return (
    <div className="container">
      <h1>Audio Crypto Recorder</h1>

      <div className="section">
        <div className="controls">
          {!isRecording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}
          <button onClick={clearData} disabled={isRecording}>Clear All</button>
        </div>

        <div className="status">
          <p>Status: {isRecording ? 'Recording...' : 'Idle'}</p>
          <p>Duration: {duration.toFixed(1)}s</p>
          <p>Chunks: {recordedChunks.length}</p>
        </div>
      </div>

      <div className="section">
        <h3>Actions</h3>
        <div className="action-row">
            <select value={encryptionMode} onChange={(e) => setEncryptionMode(e.target.value)}>
                <option value={ALGORITHMS.GCM}>AES-GCM</option>
                <option value={ALGORITHMS.CTR}>AES-CTR</option>
            </select>
            <button onClick={encryptAndStore} disabled={isRecording || recordedChunks.length === 0}>
                Encrypt & Store
            </button>
            <button onClick={decryptAndPlay} disabled={isRecording}>
                Decrypt & Play
            </button>
        </div>
        <div className="action-row">
            <label htmlFor="audio-upload" className="file-upload-label" style={{ marginRight: '10px' }}>
              Upload Audio:
            </label>
            <input
              type="file"
              id="audio-upload"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={isRecording}
            />
        </div>
        <div className="action-row">
            <button onClick={runComparison} disabled={isRecording || recordedChunks.length === 0}>
                Compare Modes (GCM vs CTR)
            </button>
        </div>
      </div>

      <div className="results-grid">
        {metrics && (
            <div className="card">
                <h3>Single Mode Results</h3>
                <p><strong>{encryptionMode}</strong></p>
                <p>Encryption: {metrics.encryptionTime.toFixed(2)} ms</p>
                {decryptionMetrics && <p>Decryption: {decryptionMetrics.decryptionTime.toFixed(2)} ms</p>}
            </div>
        )}

        {comparisonMetrics && (
            <div className="card">
                <h3>Comparison Results ({comparisonMetrics.chunkCount} chunks)</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Mode</th>
                            <th>Encryption (ms)</th>
                            <th>Decryption (ms)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>AES-GCM</td>
                            <td>{comparisonMetrics.gcm.enc.toFixed(2)}</td>
                            <td>{comparisonMetrics.gcm.dec.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>AES-CTR</td>
                            <td>{comparisonMetrics.ctr.enc.toFixed(2)}</td>
                            <td>{comparisonMetrics.ctr.dec.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )}
      </div>

      <div className="logs">
          <h3>Logs</h3>
          <div className="log-window">
            {logs.map((log, i) => <div key={i}>{log}</div>)}
          </div>
      </div>
    </div>
  );
}

export default App;
