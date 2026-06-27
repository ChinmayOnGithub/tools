export interface DuplicateRemoverOptions {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  sort: 'none' | 'asc' | 'desc';
}

export function removeDuplicateLines(text: string, options: DuplicateRemoverOptions): string {
  if (!text) return '';

  const lines = text.split(/\r?\n/);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    let processedLine = line;
    if (options.trimWhitespace) {
      processedLine = processedLine.trim();
    }

    const comparisonKey = options.caseSensitive 
      ? processedLine 
      : processedLine.toLowerCase();

    if (!seen.has(comparisonKey)) {
      seen.add(comparisonKey);
      result.push(options.trimWhitespace ? processedLine : line);
    }
  }

  if (options.sort === 'asc') {
    result.sort((a, b) => a.localeCompare(b));
  } else if (options.sort === 'desc') {
    result.sort((a, b) => b.localeCompare(a));
  }

  return result.join('\n');
}
