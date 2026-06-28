import { describe, it, expect } from 'vitest';
import { convertUnit } from './utils';

describe('Unit Converter Utilities', () => {
  it('should convert length units correctly', () => {
    expect(convertUnit('length', 1, 'km', 'm')).toBe(1000);
    expect(convertUnit('length', 12, 'in', 'ft')).toBeCloseTo(1, 5);
  });

  it('should convert weight units correctly', () => {
    expect(convertUnit('weight', 1000, 'g', 'kg')).toBe(1);
  });

  it('should convert temperatures correctly', () => {
    expect(convertUnit('temperature', 0, 'c', 'f')).toBe(32);
    expect(convertUnit('temperature', 100, 'c', 'k')).toBe(373.15);
  });

  it('should return original value for invalid units', () => {
    expect(convertUnit('length', 5, 'invalid', 'm')).toBe(5);
  });
});
