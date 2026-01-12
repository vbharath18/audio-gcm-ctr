import { openDB } from 'idb';

const DB_NAME = 'audio-crypto-db';
const STORE_NAME = 'chunks';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('sessionId', 'sessionId');
        store.createIndex('index', 'index');
      }
    },
  });
}

export async function storeChunk(sessionId, index, data, iv, algorithm) {
  const db = await initDB();
  return db.add(STORE_NAME, {
    sessionId,
    index,
    data,
    iv,
    algorithm,
    timestamp: Date.now(),
  });
}

export async function getChunks(sessionId) {
  const db = await initDB();
  const index = db.transaction(STORE_NAME).store.index('sessionId');
  const chunks = await index.getAll(sessionId);
  return chunks.sort((a, b) => a.index - b.index);
}

export async function clearStorage() {
  const db = await initDB();
  return db.clear(STORE_NAME);
}
