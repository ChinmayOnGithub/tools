export interface KeywordFreq {
  word: string;
  count: number;
  percentage: number;
}

export interface CharBreakdown {
  letters: number;
  vowels: number;
  consonants: number;
  numbers: number;
  whitespaces: number;
  symbols: number;
}

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  sentences: number;
  readingTime: string;
  speakingTime: string;
  readabilityGrade: string;
  keywords: KeywordFreq[];
  charBreakdown: CharBreakdown;
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'in', 'to', 'of',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'its', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'they', 'we', 'us', 'me', 'him', 'her',
  'them', 'my', 'your', 'their', 'our', 'with', 'as', 'by', 'for', 'about', 'with',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
  'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
  'will', 'just', 'should', 'now'
]);

export function calculateTextStats(text: string): TextStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      paragraphs: 0,
      sentences: 0,
      readingTime: '0 sec',
      speakingTime: '0 sec',
      readabilityGrade: 'N/A',
      keywords: [],
      charBreakdown: {
        letters: 0,
        vowels: 0,
        consonants: 0,
        numbers: 0,
        whitespaces: 0,
        symbols: 0
      }
    };
  }

  // Count words, filtering empty values from double spacing
  const wordsArray = trimmed
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0);
    
  const words = wordsArray.length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Count paragraphs
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  // Count sentences
  const sentences = text
    .split(/[.!?]+(?:\s+|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;

  // Reading time (average 200 WPM)
  const readTimeSeconds = Math.round((words / 200) * 60);
  let readingTime = '';
  if (readTimeSeconds < 60) {
    readingTime = `${readTimeSeconds} sec`;
  } else {
    const mins = Math.floor(readTimeSeconds / 60);
    const secs = readTimeSeconds % 60;
    readingTime = secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  }

  // Speaking time (average 130 WPM)
  const speakTimeSeconds = Math.round((words / 130) * 60);
  let speakingTime = '';
  if (speakTimeSeconds < 60) {
    speakingTime = `${speakTimeSeconds} sec`;
  } else {
    const mins = Math.floor(speakTimeSeconds / 60);
    const secs = speakTimeSeconds % 60;
    speakingTime = secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  }

  // Readability Grade (Automated Readability Index)
  let readabilityGrade = 'Easy';
  if (words > 0 && sentences > 0) {
    const ari = 4.71 * (characters / words) + 0.5 * (words / sentences) - 21.43;
    const rounded = Math.round(ari);
    if (rounded <= 4) {
      readabilityGrade = 'Easy (Grade 1-4)';
    } else if (rounded <= 8) {
      readabilityGrade = 'Average (Grade 5-8)';
    } else if (rounded <= 12) {
      readabilityGrade = 'Advanced (Grade 9-12)';
    } else {
      readabilityGrade = 'Professional (College+)';
    }
  }

  // Keyword Density Calculation (top 5 words)
  const wordCounts: Record<string, number> = {};
  let validWordCount = 0;

  wordsArray.forEach((w) => {
    if (w.length > 2 && !STOP_WORDS.has(w) && isNaN(Number(w))) {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
      validWordCount++;
    }
  });

  const sortedKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({
      word,
      count,
      percentage: validWordCount > 0 ? parseFloat(((count / validWordCount) * 100).toFixed(1)) : 0,
    }));

  // Character Breakdown
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const vowels = (text.match(/[aeiouAEIOU]/g) || []).length;
  const consonants = Math.max(0, letters - vowels);
  const numbers = (text.match(/[0-9]/g) || []).length;
  const whitespaces = (text.match(/\s/g) || []).length;
  const symbols = Math.max(0, text.length - letters - numbers - whitespaces);

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    sentences,
    readingTime,
    speakingTime,
    readabilityGrade,
    keywords: sortedKeywords,
    charBreakdown: {
      letters,
      vowels,
      consonants,
      numbers,
      whitespaces,
      symbols
    }
  };
}
