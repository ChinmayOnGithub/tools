import { describe, it, expect } from 'vitest';
import { isValidUrl, getQrOptions } from './utils';

describe('QR Generator Utilities', () => {
  it('should validate URLs correctly', () => {
    expect(isValidUrl('https://google.com')).toBe(true);
    expect(isValidUrl('not-a-url')).toBe(false);
  });

  it('should construct options correctly', () => {
    const opts = getQrOptions(200, '#000', '#fff');
    expect(opts.width).toBe(200);
    expect(opts.color.dark).toBe('#000');
    expect(opts.color.light).toBe('#fff');
  });
});
