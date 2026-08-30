export interface UnicodeCharInfo {
  index: number;
  char: string;
  codePoint: number;
  hex: string;
  decimal: number;
  utf8Hex: string;
  utf16Hex: string;
  category: string;
  name: string;
  isHidden: boolean;
  isBidiControl: boolean;
  isZeroWidth: boolean;
}

// Convert codepoint to UTF-8 hex bytes (e.g., "E2 80 8B")
export function getUtf8Bytes(char: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(char);
  return Array.from(bytes)
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');
}

// Convert codepoint to UTF-16 code units (e.g., "D83D DE00" for surrogate pairs)
export function getUtf16Units(char: string): string {
  const units: string[] = [];
  for (let i = 0; i < char.length; i++) {
    units.push(char.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0'));
  }
  return units.join(' ');
}

// Classify character into Unicode general category groups
export function getUnicodeCategory(codePoint: number): string {
  if (codePoint >= 0x0000 && codePoint <= 0x001f) return 'Cc (Control)';
  if (codePoint >= 0x007f && codePoint <= 0x009f) return 'Cc (Control)';
  if (codePoint === 0x0020 || codePoint === 0x00a0 || (codePoint >= 0x2000 && codePoint <= 0x200a)) return 'Zs (Space Separator)';
  if (codePoint === 0x2028) return 'Zl (Line Separator)';
  if (codePoint === 0x2029) return 'Zp (Paragraph Separator)';
  if (codePoint >= 0x200b && codePoint <= 0x200d) return 'Cf (Format / Zero-Width)';
  if (codePoint >= 0x202a && codePoint <= 0x202e) return 'Cf (BiDi Control)';
  if (codePoint === 0xfeff) return 'Cf (BOM / Zero-Width No-Break)';
  if ((codePoint >= 0x0041 && codePoint <= 0x005a) || (codePoint >= 0x0061 && codePoint <= 0x007a)) return 'L (Latin Letter)';
  if (codePoint >= 0x0030 && codePoint <= 0x0039) return 'Nd (Decimal Digit)';
  if (codePoint >= 0x1f600 && codePoint <= 0x1f64f) return 'So (Emoji Emoticon)';
  if (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) return 'So (Emoji Symbol)';
  if (codePoint >= 0x1f900 && codePoint <= 0x1f9ff) return 'So (Supplemental Emoji)';
  if (codePoint >= 0x2600 && codePoint <= 0x27bf) return 'So (Misc Symbols & Dingbats)';
  return 'General Unicode Character';
}

export function inspectText(text: string): UnicodeCharInfo[] {
  if (!text) return [];

  // Use Array.from to correctly loop over surrogate pairs (emojis/supplementary chars)
  const chars = Array.from(text);
  return chars.map((char, index) => {
    const codePoint = char.codePointAt(0) || 0;
    const hex = `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
    const decimal = codePoint;
    const utf8Hex = getUtf8Bytes(char);
    const utf16Hex = getUtf16Units(char);
    const category = getUnicodeCategory(codePoint);

    let name = 'Standard Character';
    let isHidden = false;
    let isBidiControl = false;
    let isZeroWidth = false;

    // Detect control, invisible, bidi, and zero-width characters
    if (codePoint === 0x200b) {
      name = 'Zero-Width Space (ZWSP)';
      isHidden = true;
      isZeroWidth = true;
    } else if (codePoint === 0x200c) {
      name = 'Zero-Width Non-Joiner (ZWNJ)';
      isHidden = true;
      isZeroWidth = true;
    } else if (codePoint === 0x200d) {
      name = 'Zero-Width Joiner (ZWJ)';
      isHidden = true;
      isZeroWidth = true;
    } else if (codePoint === 0xfeff) {
      name = 'Byte Order Mark / Zero-Width No-Break (BOM)';
      isHidden = true;
      isZeroWidth = true;
    } else if (codePoint === 0x200e) {
      name = 'Left-to-Right Mark (LRM)';
      isHidden = true;
      isBidiControl = true;
    } else if (codePoint === 0x200f) {
      name = 'Right-to-Left Mark (RLM)';
      isHidden = true;
      isBidiControl = true;
    } else if (codePoint >= 0x202a && codePoint <= 0x202e) {
      name = 'Bi-Directional Override Control';
      isHidden = true;
      isBidiControl = true;
    } else if (codePoint === 0x00a0) {
      name = 'Non-Breaking Space (NBSP)';
      isHidden = true;
    } else if (codePoint === 0x0009) {
      name = 'Tab (Horizontal \t)';
      isHidden = true;
    } else if (codePoint === 0x000a) {
      name = 'Line Feed / Newline (\n)';
      isHidden = true;
    } else if (codePoint === 0x000d) {
      name = 'Carriage Return (\r)';
      isHidden = true;
    } else if (codePoint >= 0x0000 && codePoint <= 0x001f) {
      name = `Control Character (0x${codePoint.toString(16).toUpperCase().padStart(2, '0')})`;
      isHidden = true;
    } else if (codePoint >= 0x1f600 && codePoint <= 0x1f64f) {
      name = 'Emoji (Emoticon)';
    } else if (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) {
      name = 'Emoji (Pictograph / Symbol)';
    } else if (codePoint >= 0x1f900 && codePoint <= 0x1f9ff) {
      name = 'Emoji (Supplemental)';
    }

    return {
      index,
      char,
      codePoint,
      hex,
      decimal,
      utf8Hex,
      utf16Hex,
      category,
      name,
      isHidden,
      isBidiControl,
      isZeroWidth,
    };
  });
}
