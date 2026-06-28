import { describe, it, expect } from 'vitest';
import { calculateAspectRatioDimensions, formatByteSize } from './utils';

describe('Image Compressor Utilities', () => {
  describe('calculateAspectRatioDimensions', () => {
    it('should scale down maintaining aspect ratio', () => {
      const result = calculateAspectRatioDimensions(1000, 500, 500);
      expect(result).toEqual({ width: 500, height: 250 });
    });

    it('should scale down based on height if height is larger', () => {
      const result = calculateAspectRatioDimensions(300, 600, 300);
      expect(result).toEqual({ width: 150, height: 300 });
    });

    it('should keep original dimensions if smaller than maximum limit', () => {
      const result = calculateAspectRatioDimensions(100, 100, 200);
      expect(result).toEqual({ width: 100, height: 100 });
    });
  });

  describe('formatByteSize', () => {
    it('should convert bytes to KB and MB', () => {
      expect(formatByteSize(1024)).toBe('1 KB');
      expect(formatByteSize(1048576)).toBe('1 MB');
    });
  });
});
