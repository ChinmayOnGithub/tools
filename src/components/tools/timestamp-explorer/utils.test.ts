import { describe, it, expect } from 'vitest';
import { parseEpoch, getRelativeTime } from './utils';

describe('Timestamp Explorer Utilities', () => {
  it('should parse 10-digit unix epoch seconds accurately', () => {
    const res = parseEpoch('1719600000');
    expect(res.isValid).toBe(true);
    expect(res.epochSeconds).toBe(1719600000);
    expect(res.epochMilliseconds).toBe(1719600000000);
    expect(res.detectedUnit).toBe('seconds');
    expect(res.iso8601).toBe('2024-06-28T18:40:00.000Z');
  });

  it('should parse 13-digit unix epoch milliseconds accurately', () => {
    const res = parseEpoch('1719600000000');
    expect(res.isValid).toBe(true);
    expect(res.epochSeconds).toBe(1719600000);
    expect(res.epochMilliseconds).toBe(1719600000000);
    expect(res.detectedUnit).toBe('milliseconds');
    expect(res.iso8601).toBe('2024-06-28T18:40:00.000Z');
  });

  it('should parse ISO date strings accurately', () => {
    const res = parseEpoch('2026-06-28T12:00:00.000Z');
    expect(res.isValid).toBe(true);
    expect(res.detectedUnit).toBe('iso-string');
    expect(res.epochSeconds).toBe(1782648000);
  });

  it('should format relative distances', () => {
    const now = Date.now();
    const past = now - 3600 * 1000;
    expect(getRelativeTime(past)).toBe('1 hour ago');
  });
});
