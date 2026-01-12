export const ALGORITHMS = {
  GCM: 'AES-GCM',
  CTR: 'AES-CTR',
};

export async function generateKey(algorithm) {
  return await window.crypto.subtle.generateKey(
    {
      name: algorithm,
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptChunk(data, key, algorithm) {
  let params;
  let iv;

  if (algorithm === ALGORITHMS.GCM) {
    iv = window.crypto.getRandomValues(new Uint8Array(12));
    params = { name: ALGORITHMS.GCM, iv };
  } else if (algorithm === ALGORITHMS.CTR) {
    iv = window.crypto.getRandomValues(new Uint8Array(16));
    params = { name: ALGORITHMS.CTR, counter: iv, length: 64 };
  } else {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    params,
    key,
    data
  );

  return {
    data: encryptedBuffer,
    iv,
  };
}

export async function decryptChunk(encryptedData, iv, key, algorithm) {
  let params;

  if (algorithm === ALGORITHMS.GCM) {
    params = { name: ALGORITHMS.GCM, iv };
  } else if (algorithm === ALGORITHMS.CTR) {
    params = { name: ALGORITHMS.CTR, counter: iv, length: 64 };
  } else {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  return await window.crypto.subtle.decrypt(
    params,
    key,
    encryptedData
  );
}
