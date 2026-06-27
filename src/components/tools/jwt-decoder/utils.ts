export interface JWTDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean;
  issuedAtDate?: string;
  expirationDate?: string;
}

export function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeJWT(token: string): { success: boolean; data?: JWTDecoded; error?: string } {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { success: false, error: 'Token must have 3 parts separated by dots (Header.Payload.Signature).' };
    }

    const headerStr = base64UrlDecode(parts[0]);
    const payloadStr = base64UrlDecode(parts[1]);

    const header = JSON.parse(headerStr) as Record<string, unknown>;
    const payload = JSON.parse(payloadStr) as Record<string, unknown>;
    const signature = parts[2];

    let isExpired = false;
    let expirationDate: string | undefined;
    let issuedAtDate: string | undefined;

    if (payload.exp && typeof payload.exp === 'number') {
      const expMs = payload.exp * 1000;
      isExpired = Date.now() > expMs;
      expirationDate = new Date(expMs).toLocaleString();
    }

    if (payload.iat && typeof payload.iat === 'number') {
      issuedAtDate = new Date(payload.iat * 1000).toLocaleString();
    }

    return {
      success: true,
      data: {
        header,
        payload,
        signature,
        isExpired,
        expirationDate,
        issuedAtDate,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Malformed token structure';
    return { success: false, error: errorMsg };
  }
}
