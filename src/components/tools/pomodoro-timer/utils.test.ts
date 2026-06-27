import { describe, it, expect } from 'vitest';
import { formatTime } from './utils';

describe('Pomodoro Timer utilities', () => {
  it('correctly formats seconds into MM:SS format strings', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(9)).toBe('00:09');
    expect(formatTime(59)).toBe('00:59');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(125)).toBe('02:05');
    expect(formatTime(3599)).toBe('59:59');
  });
});
