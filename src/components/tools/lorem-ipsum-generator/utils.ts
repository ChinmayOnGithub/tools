const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum'
];

export interface LoremOptions {
  type: 'words' | 'sentences' | 'paragraphs';
  amount: number;
  format: 'text' | 'html';
  startWithLorem: boolean;
}

export function generateLorem(options: LoremOptions): string {
  const amount = Math.max(1, Math.min(500, options.amount));
  
  if (options.type === 'words') {
    const list: string[] = [];
    if (options.startWithLorem) {
      list.push('Lorem', 'ipsum');
    }
    
    while (list.length < amount) {
      const idx = Math.floor(Math.random() * LOREM_WORDS.length);
      const word = LOREM_WORDS[idx];
      list.push(list.length === 0 ? word.charAt(0).toUpperCase() + word.substring(1) : word.toLowerCase());
    }
    
    const text = list.join(' ') + '.';
    return options.format === 'html' ? `<p>${text}</p>` : text;
  }

  const generateSentence = (startWithLoremNow = false): string => {
    const len = Math.floor(Math.random() * 8) + 6;
    const list: string[] = [];
    if (startWithLoremNow) {
      list.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    }
    
    while (list.length < len) {
      const idx = Math.floor(Math.random() * LOREM_WORDS.length);
      const word = LOREM_WORDS[idx];
      list.push(word.toLowerCase());
    }
    
    return list[0].charAt(0).toUpperCase() + list.slice(1).join(' ') + '.';
  };

  if (options.type === 'sentences') {
    const sentencesList: string[] = [];
    for (let i = 0; i < amount; i++) {
      sentencesList.push(generateSentence(i === 0 && options.startWithLorem));
    }
    const text = sentencesList.join(' ');
    return options.format === 'html' ? `<p>${text}</p>` : text;
  }

  const paragraphsList: string[] = [];
  for (let i = 0; i < amount; i++) {
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    const sentencesList: string[] = [];
    for (let s = 0; s < sentenceCount; s++) {
      sentencesList.push(generateSentence(i === 0 && s === 0 && options.startWithLorem));
    }
    paragraphsList.push(sentencesList.join(' '));
  }

  if (options.format === 'html') {
    return paragraphsList.map((p) => `<p>${p}</p>`).join('\n');
  }
  return paragraphsList.join('\n\n');
}
