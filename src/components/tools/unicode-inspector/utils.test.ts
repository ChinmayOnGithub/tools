import { describe, it, expect } from 'vitest';
import { inspectText } from './utils';

describe('Unicode Inspector Utilities', () => {
  it('should inspect standard text correctly', () => {
    const res = inspectText('Hi');
    expect(res).toHaveLength(2);
    expect(res[0].char).toBe('H');
    expect(res[0].hex).toBe('U+0048');
  });

  it('should detect zero-width characters', () => {
    const res = inspectText('\u200b');
    expect(res).toHaveLength(1);
    expect(res[0].name).toBe('Zero-Width Space');
    expect(res[0].isHidden).toBe(true);
  });
});
