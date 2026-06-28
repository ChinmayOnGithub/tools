import { describe, it, expect } from 'vitest';
import { scaleCropCoordinates } from './utils';

describe('scaleCropCoordinates', () => {
  it('should scale coordinate systems proportionally', () => {
    const result = scaleCropCoordinates(100, 100, 1000, 1000, 10, 20, 30, 40);
    expect(result).toEqual({ x: 100, y: 200, width: 300, height: 400 });
  });

  it('should return 0 when container size is invalid', () => {
    const result = scaleCropCoordinates(0, 100, 1000, 1000, 10, 20, 30, 40);
    expect(result).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });
});
