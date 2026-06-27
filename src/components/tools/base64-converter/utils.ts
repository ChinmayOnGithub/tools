export function encodeBase64Text(str: string): string {
  try {
    // UTF-8 compatible encoding trick
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return '';
  }
}

export function decodeBase64Text(str: string): { success: boolean; output: string; error?: string } {
  try {
    // UTF-8 compatible decoding trick
    const decoded = decodeURIComponent(escape(atob(str)));
    return { success: true, output: decoded };
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { success: false, output: '', error: errorObj.message };
  }
}

export function base64ToBlob(base64: string, mimeType = 'application/octet-stream'): Blob | null {
  try {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch {
    return null;
  }
}
