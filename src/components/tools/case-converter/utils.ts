function getWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

export function convertCase(text: string, style: string): string {
  if (!text) return '';

  switch (style) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.toLowerCase().replace(/\b([a-zA-Z])/g, (m) => m.toUpperCase());
    case 'sentence':
      return text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase());
    case 'camel': {
      const words = getWords(text);
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()))
        .join('');
    }
    case 'pascal': {
      const words = getWords(text);
      return words.map((w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()).join('');
    }
    case 'snake': {
      const words = getWords(text);
      return words.map((w) => w.toLowerCase()).join('_');
    }
    case 'kebab': {
      const words = getWords(text);
      return words.map((w) => w.toLowerCase()).join('-');
    }
    case 'train': {
      const words = getWords(text);
      return words.map((w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()).join('-');
    }
    case 'dot': {
      const words = getWords(text);
      return words.map((w) => w.toLowerCase()).join('.');
    }
    default:
      return text;
  }
}
