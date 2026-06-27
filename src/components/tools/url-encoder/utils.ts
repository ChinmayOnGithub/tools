export function encodeURLString(str: string): string {
  return encodeURIComponent(str);
}

export function decodeURLString(str: string): { success: boolean; output: string; error?: string } {
  try {
    return { success: true, output: decodeURIComponent(str) };
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { success: false, output: '', error: errorObj.message };
  }
}
