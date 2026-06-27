import { describe, it, expect } from 'vitest';
import { calculateTextStats } from './utils';

describe('Word Counter utilities', () => {
  it('correctly calculates basic text parameters', () => {
    const text = 'Hello world. This is a word counter.';
    const stats = calculateTextStats(text);
    
    expect(stats.words).toBe(7);
    expect(stats.characters).toBe(36);
    expect(stats.charactersNoSpaces).toBe(30);
    expect(stats.paragraphs).toBe(1);
    expect(stats.sentences).toBe(2);
  });

  it('correctly calculates paragraphs and sentences', () => {
    const text = "First paragraph.\n\nSecond paragraph! Is it working?";
    const stats = calculateTextStats(text);
    
    expect(stats.paragraphs).toBe(2);
    expect(stats.sentences).toBe(3);
  });

  it('returns zeroes on empty strings', () => {
    const stats = calculateTextStats('   ');
    expect(stats.words).toBe(0);
    expect(stats.paragraphs).toBe(0);
    expect(stats.sentences).toBe(0);
  });
});
