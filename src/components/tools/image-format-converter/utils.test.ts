import { describe, it, expect } from 'vitest';
import { mimeToExtension, extensionToMime } from './utils';

describe('Image Format Converter Utilities', () => {
  it('should map mime to extensions correctly', () => {
    expect(mimeToExtension('image/png')).toBe('png');
    expect(mimeToExtension('image/jpeg')).toBe('jpg');
    expect(mimeToExtension('image/webp')).toBe('webp');
    expect(mimeToExtension('application/pdf')).toBe('bin');
  });

  it('should map extensions to mime types correctly', () => {
    expect(extensionToMime('png')).toBe('image/png');
    expect(extensionToMime('jpg')).toBe('image/jpeg');
    expect(extensionToMime('webp')).toBe('image/webp');
    expect(extensionToMime('exe')).toBe('application/octet-stream');
  });
});
