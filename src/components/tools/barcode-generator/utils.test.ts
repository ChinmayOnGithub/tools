import { describe, it, expect } from 'vitest';
import { validateBarcodeContent } from './utils';

describe('Barcode Validation Utilities', () => {
  it('should validate EAN13 formats correctly', () => {
    expect(validateBarcodeContent('EAN13', '1234567890128')).toBe(true);
    expect(validateBarcodeContent('EAN13', '12345')).toBe(false);
    expect(validateBarcodeContent('EAN13', 'abc')).toBe(false);
  });

  it('should validate EAN8 formats correctly', () => {
    expect(validateBarcodeContent('EAN8', '12345670')).toBe(true);
    expect(validateBarcodeContent('EAN8', '123')).toBe(false);
  });

  it('should return true for CODE128 text values', () => {
    expect(validateBarcodeContent('CODE128', 'HelloWorld123')).toBe(true);
  });
});
