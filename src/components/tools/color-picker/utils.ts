export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Converts Hex string to RGB.
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts RGB numbers to Hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  return '#' + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
}

/**
 * Converts RGB to HSL values.
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to Hex.
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
}

/**
 * Generates complementary, analogous, triadic, and monochromatic color palettes.
 */
export function generatePalettes(hex: string): {
  complementary: string[];
  analogous: string[];
  triadic: string[];
  monochromatic: string[];
} {
  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Complementary: base hue + 180
  const compHex = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);

  // Analogous: base hue +/- 30
  const ana1 = hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l);
  const ana2 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);

  // Triadic: base hue + 120, + 240
  const tri1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const tri2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);

  // Monochromatic: vary light levels
  const mono1 = hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20));
  const mono2 = hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 10));
  const mono3 = hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 10));
  const mono4 = hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 20));

  return {
    complementary: [hex, compHex],
    analogous: [ana1, hex, ana2],
    triadic: [hex, tri1, tri2],
    monochromatic: [mono1, mono2, hex, mono3, mono4],
  };
}
