import { describe, it, expect } from 'vitest';
import { decodeJWT } from './utils';

// Standard mock JWT token
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('JWT Decoder utilities', () => {
  it('correctly decodes standard JWT headers and claims', () => {
    const result = decodeJWT(mockToken);
    expect(result.success).toBe(true);
    expect(result.data?.header.alg).toBe('HS256');
    expect(result.data?.payload.name).toBe('John Doe');
    expect(result.data?.issuedAtDate).toBeDefined();
  });

  it('correctly handles expired token checks', () => {
    const expiredPayload = {
      sub: '123',
      exp: Math.floor(Date.now() / 1000) - 60 // 1 minute ago
    };
    const headerStr = btoa(JSON.stringify({ alg: 'HS256' }));
    const payloadStr = btoa(JSON.stringify(expiredPayload));
    const token = `${headerStr}.${payloadStr}.sig`;

    const result = decodeJWT(token);
    expect(result.success).toBe(true);
    expect(result.data?.isExpired).toBe(true);
  });

  it('fails gracefully on malformed tokens', () => {
    const result1 = decodeJWT('invalid-token');
    expect(result1.success).toBe(false);
    expect(result1.error).toContain('separated by dots');

    const result2 = decodeJWT('header.payload');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('separated by dots');
  });
});
