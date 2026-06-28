import { describe, it, expect } from 'vitest';
import { timeFieldsToSeconds, secondsToTimeFields } from './utils';

describe('Countdown Timer Conversions', () => {
  it('should convert time fields to seconds correctly', () => {
    expect(timeFieldsToSeconds({ hours: 1, minutes: 1, seconds: 1 })).toBe(3661);
    expect(timeFieldsToSeconds({ hours: 0, minutes: 5, seconds: 0 })).toBe(300);
  });

  it('should convert seconds to time fields correctly', () => {
    expect(secondsToTimeFields(3661)).toEqual({ hours: 1, minutes: 1, seconds: 1 });
    expect(secondsToTimeFields(300)).toEqual({ hours: 0, minutes: 5, seconds: 0 });
    expect(secondsToTimeFields(-100)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });
});
