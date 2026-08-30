import { describe, it, expect } from 'vitest';
import { inspectText, getUtf8Bytes, getUtf16Units } from './utils';

describe('Unicode Inspector Utilities', () => {
  it('should inspect standard text correctly', () => {
    const res = inspectText('Hi');
    expect(res).toHaveLength(2);
    expect(res[0].char).toBe('H');
    expect(res[0].hex).toBe('U+0048');
    expect(res[0].decimal).toBe(72);
    expect(res[0].utf8Hex).toBe('48');
    expect(res[0].utf16Hex).toBe('0048');
  });

  it('should detect zero-width characters and metadata', () => {
    const res = inspectText('\u200b');
    expect(res).toHaveLength(1);
    expect(res[0].name).toContain('Zero-Width Space');
    expect(res[0].isHidden).toBe(true);
    expect(res[0].isZeroWidth).toBe(true);
    expect(res[0].utf8Hex).toBe('E2 80 8B');
  });

  it('should detect bidi controls correctly', () => {
    const res = inspectText('\u202E');
    expect(res).toHaveLength(1);
    expect(res[0].isBidiControl).toBe(true);
    expect(res[0].isHidden).toBe(true);
  });

  it('should compute surrogate pairs for emojis', () => {
    const units = getUtf16Units('👋');
    expect(units).toBe('D83D DC4B');
    const bytes = getUtf8Bytes('👋');
    expect(bytes).toBe('F0 9F 91 8B');
  });
});
