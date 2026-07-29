export interface UnicodeCharInfo {
  index: number;
  char: string;
  codePoint: number;
  hex: string;
  name: string;
  isHidden: boolean;
}

export function inspectText(text: string): UnicodeCharInfo[] {
  if (!text) return [];

  // Use Array.from to correctly loop over surrogate pairs (emojis/supplementary chars)
  const chars = Array.from(text);
  return chars.map((char, index) => {
    const codePoint = char.codePointAt(0) || 0;
    const hex = `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
    let name = 'Standard Character';
    let isHidden = false;

    // Detect control and hidden Unicode spaces
    if (codePoint === 0x200b) {
      name = 'Zero-Width Space';
      isHidden = true;
    } else if (codePoint === 0x200c) {
      name = 'Zero-Width Non-Joiner';
      isHidden = true;
    } else if (codePoint === 0x200d) {
      name = 'Zero-Width Joiner';
      isHidden = true;
    } else if (codePoint === 0xfeff) {
      name = 'Byte Order Mark (BOM)';
      isHidden = true;
    } else if (codePoint === 0x2020) {
      name = 'Dagger';
    } else if (codePoint === 0x00a0) {
      name = 'Non-Breaking Space';
      isHidden = true;
    } else if (codePoint === 0x0009) {
      name = 'Tab (Horizontal)';
      isHidden = true;
    } else if (codePoint === 0x000a) {
      name = 'Line Feed (Newline)';
      isHidden = true;
    } else if (codePoint === 0x000d) {
      name = 'Carriage Return';
      isHidden = true;
    } else if (codePoint >= 0x0000 && codePoint <= 0x001f) {
      name = 'Control Character';
      isHidden = true;
    } else if (codePoint >= 0x1f600 && codePoint <= 0x1f64f) {
      name = 'Emoji (Emoticon)';
    } else if (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) {
      name = 'Emoji (Symbol)';
    }

    return {
      index,
      char,
      codePoint,
      hex,
      name,
      isHidden,
    };
  });
}
