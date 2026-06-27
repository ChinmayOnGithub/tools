import { describe, it, expect } from 'vitest';
import { encodeURLString, decodeURLString } from './utils';

describe('URL encoder utilities', () => {
  it('encodes special URL characters', () => {
    const raw = 'hello world & welcome = true';
    const encoded = encodeURLString(raw);
    expect(encoded).toBe('hello%20world%20%26%20welcome%20%3D%20true');
  });

  it('decodes encoded URL strings successfully', () => {
    const encoded = 'hello%20world%20%26%20welcome%20%3D%20true';
    const decoded = decodeURLString(encoded);
    expect(decoded.success).toBe(true);
    expect(decoded.output).toBe('hello world & welcome = true');
  });

  it('handles invalid percent encodes gracefully', () => {
    const bad = 'hello%2world';
    const decoded = decodeURLString(bad);
    expect(decoded.success).toBe(false);
    expect(decoded.error).toBeDefined();
  });
});
