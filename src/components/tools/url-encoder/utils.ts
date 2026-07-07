export function encodeURLString(str: string, queryOnly = false): string {
  if (!queryOnly) {
    return encodeURIComponent(str);
  }
  try {
    const url = new URL(str);
    // Parse query params and encode them individually
    const searchParams = new URLSearchParams(url.search);
    const newParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      newParams.set(encodeURIComponent(key), encodeURIComponent(value));
    });
    url.search = newParams.toString();
    return url.toString();
  } catch {
    // If not a full URL, fall back to encoding the query-like string manually
    if (str.includes('=') || str.includes('&')) {
      return str.split('&').map(part => {
        const index = part.indexOf('=');
        if (index !== -1) {
          const key = part.slice(0, index);
          const value = part.slice(index + 1);
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        return encodeURIComponent(part);
      }).join('&');
    }
    return encodeURIComponent(str);
  }
}

export function decodeURLString(str: string): { success: boolean; output: string; error?: string } {
  try {
    return { success: true, output: decodeURIComponent(str) };
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { success: false, output: '', error: errorObj.message };
  }
}
