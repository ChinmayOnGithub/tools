import { describe, it, expect } from 'vitest';
import { encodeBase64Text, decodeBase64Text, base64ToBlob } from './utils';

describe('Base64 converter utilities', () => {
  it('encodes UTF-8 strings correctly', () => {
    const raw = 'hello world 🌟 unicode';
    const encoded = encodeBase64Text(raw);
    expect(encoded).toBe('aGVsbG8gd29ybGQg8J+MnyB1bmljb2Rl');
  });

  it('decodes UTF-8 Base64 strings correctly', () => {
    const encoded = 'aGVsbG8gd29ybGQg8J+MnyB1bmljb2Rl';
    const result = decodeBase64Text(encoded);
    expect(result.success).toBe(true);
    expect(result.output).toBe('hello world 🌟 unicode');
  });

  it('handles invalid Base64 decoding gracefully', () => {
    const bad = 'invalid_base64_string!!!';
    const result = decodeBase64Text(bad);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('converts base64 to binary Blob', () => {
    const data = 'SGVsbG8=';
    const blob = base64ToBlob(data, 'text/plain');
    expect(blob).not.toBeNull();
    expect(blob?.size).toBe(5);
  });
});
