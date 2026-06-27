export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  sentences: number;
  readingTime: string;
  speakingTime: string;
}

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
    };
  }

  // Count words, filtering empty values from double spacing
  const wordsArray = trimmed.split(/\s+/).filter((w) => w.length > 0);
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

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    sentences,
    readingTime,
    speakingTime,
  };
}
