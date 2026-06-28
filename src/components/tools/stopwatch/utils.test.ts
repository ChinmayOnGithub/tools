import { describe, it, expect } from 'vitest';
import { formatElapsedDuration } from './utils';

describe('formatElapsedDuration', () => {
  it('should format milliseconds to MM:SS.cc format correctly', () => {
    expect(formatElapsedDuration(0)).toBe('00:00.00');
    expect(formatElapsedDuration(1230)).toBe('00:01.23');
    expect(formatElapsedDuration(60000)).toBe('01:00.00');
    expect(formatElapsedDuration(3661050)).toBe('01:01:01.05');
  });

  it('should return default time for negative values', () => {
    expect(formatElapsedDuration(-500)).toBe('00:00.00');
  });
});
