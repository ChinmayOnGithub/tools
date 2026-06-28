import { describe, it, expect } from 'vitest';
import { getProportionalHeight, getProportionalWidth } from './utils';

describe('Image Resizer Proportions', () => {
  it('should compute height proportionally', () => {
    expect(getProportionalHeight(100, 50, 200)).toBe(100);
    expect(getProportionalHeight(100, 200, 50)).toBe(100);
  });

  it('should compute width proportionally', () => {
    expect(getProportionalWidth(100, 50, 100)).toBe(200);
    expect(getProportionalWidth(100, 200, 100)).toBe(50);
  });

  it('should return 0 for invalid inputs', () => {
    expect(getProportionalHeight(0, 50, 100)).toBe(0);
    expect(getProportionalWidth(100, 0, 100)).toBe(0);
  });
});
