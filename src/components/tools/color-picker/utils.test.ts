import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, rgbToHsl, hslToHex, generatePalettes } from './utils';

describe('Color Picker Utilities', () => {
  it('should convert Hex to RGB and back', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
  });

  it('should convert RGB to HSL and back', () => {
    // Red color
    const hsl = rgbToHsl(255, 0, 0);
    expect(hsl).toEqual({ h: 0, s: 100, l: 50 });
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
  });

  it('should generate distinct palette sets', () => {
    const palettes = generatePalettes('#ff0000');
    expect(palettes.complementary.length).toBe(2);
    expect(palettes.analogous.length).toBe(3);
    expect(palettes.triadic.length).toBe(3);
    expect(palettes.monochromatic.length).toBe(5);
  });
});
