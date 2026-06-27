import { describe, it, expect } from 'vitest';
import { removeDuplicateLines } from './utils';

describe('Remove Duplicate Lines utilities', () => {
  const text = 'apple\nbanana\napple\nBanana\n  cherry  ';

  it('removes duplicates case-sensitively without trimming', () => {
    const result = removeDuplicateLines(text, {
      caseSensitive: true,
      trimWhitespace: false,
      sort: 'none'
    });
    expect(result).toBe('apple\nbanana\nBanana\n  cherry  ');
  });

  it('removes duplicates case-insensitively', () => {
    const result = removeDuplicateLines(text, {
      caseSensitive: false,
      trimWhitespace: false,
      sort: 'none'
    });
    expect(result).toBe('apple\nbanana\n  cherry  ');
  });

  it('removes duplicates with whitespace trimming', () => {
    const result = removeDuplicateLines('apple\n apple \ncherry', {
      caseSensitive: true,
      trimWhitespace: true,
      sort: 'none'
    });
    expect(result).toBe('apple\ncherry');
  });

  it('sorts outputs alphabetically', () => {
    const result = removeDuplicateLines('cherry\nbanana\napple', {
      caseSensitive: true,
      trimWhitespace: false,
      sort: 'asc'
    });
    expect(result).toBe('apple\nbanana\ncherry');
  });
});
