import { describe, it, expect } from 'vitest';
import { parseEpoch } from './utils';

describe('Timestamp Explorer Utilities', () => {
  it('should parse valid seconds timestamp correctly', () => {
    // 1719600000 = Fri Jun 28 2024 18:40:00 UTC
    const res = parseEpoch('1719600000');
    expect(res.isValid).toBe(true);
    expect(res.epochSeconds).toBe(1719600000);
    expect(res.iso8601).toBe('2024-06-28T18:40:00.000Z');
  });

  it('should parse valid milliseconds timestamp correctly', () => {
    const res = parseEpoch('1719600000000');
    expect(res.isValid).toBe(true);
    expect(res.epochMilliseconds).toBe(1719600000000);
  });

  it('should return invalid for empty input', () => {
    const res = parseEpoch('');
    expect(res.isValid).toBe(false);
  });
});
