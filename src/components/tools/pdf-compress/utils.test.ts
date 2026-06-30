import { describe, it, expect } from 'vitest';
import { formatBytes } from './utils';

describe('PDF Compressor Utilities', () => {
  describe('formatBytes', () => {
    it('should format 0 bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('should format kilobytes correctly', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(2048)).toBe('2 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
    });

    it('should format megabytes correctly', () => {
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1572864)).toBe('1.5 MB');
    });

    it('should respect custom decimal configurations', () => {
      expect(formatBytes(1536, 0)).toBe('2 KB'); // rounded
      expect(formatBytes(1536, 1)).toBe('1.5 KB');
    });
  });
});
