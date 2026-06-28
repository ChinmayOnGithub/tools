import { describe, it, expect } from 'vitest';
import { formatTime } from './utils';

describe('formatTime', () => {
  const testDate = new Date('2026-06-28T14:05:09');

  it('should format 24-hour time with seconds', () => {
    expect(formatTime(testDate, true, true)).toBe('14:05:09');
  });

  it('should format 12-hour time without seconds', () => {
    expect(formatTime(testDate, false, false)).toBe('02:05 PM');
  });

  it('should format midnight correctly in 12-hour format', () => {
    const midnight = new Date('2026-06-28T00:00:00');
    expect(formatTime(midnight, false, false)).toBe('12:00 AM');
  });
});
