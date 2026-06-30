/**
 * Helper to format raw bytes into human-readable strings (e.g. MB, KB).
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Spawns the background Ghostscript worker and wraps communication in a Promise.
 */
export function compressPdfWorker(
  file: File,
  preset: 'screen' | 'ebook' | 'printer' | 'prepress',
  onProgress: (message: string) => void
): Promise<ArrayBuffer> {
  return new Promise(async (resolve, reject) => {
    // Safety check: verify file buffer can be read
    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (err) {
      reject(new Error('Failed to read PDF file data: ' + (err as Error).message));
      return;
    }

    // Set up Web Worker from public asset path
    const worker = new Worker('/wasm/pdf-compress-worker.js');

    // Get absolute origin URL to pass to the worker so it can resolve importScripts
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    worker.onmessage = (event: MessageEvent) => {
      const { type, message, data, error } = event.data;

      if (type === 'progress') {
        onProgress(message);
      } else if (type === 'done') {
        worker.terminate();
        resolve(data);
      } else if (type === 'error') {
        worker.terminate();
        reject(new Error(error));
      }
    };

    worker.onerror = (err) => {
      console.error('Worker thread crashed:', err);
      worker.terminate();
      reject(new Error('Worker thread crashed. The PDF file may be too large or malformed.'));
    };

    // Send data to worker. We transfer the ArrayBuffer to avoid copies.
    worker.postMessage({
      type: 'compress',
      fileData: arrayBuffer,
      preset,
      baseUrl
    }, [arrayBuffer]);
  });
}
