import { describe, it, expect } from 'vitest';
import { generateLorem } from './utils';

describe('Lorem Ipsum Generator utilities', () => {
  it('correctly generates words list count', () => {
    const text = generateLorem({
      type: 'words',
      amount: 10,
      format: 'text',
      startWithLorem: true
    });
    
    const words = text.split(' ');
    expect(words.length).toBe(10);
    expect(text.startsWith('Lorem ipsum')).toBe(true);
  });

  it('correctly generates sentences count', () => {
    const text = generateLorem({
      type: 'sentences',
      amount: 4,
      format: 'text',
      startWithLorem: false
    });
    
    const sentences = text.split(/[.!?]+(?:\s+|$)/).filter((s) => s.trim().length > 0);
    expect(sentences.length).toBe(4);
  });

  it('correctly generates paragraphs with HTML format', () => {
    const text = generateLorem({
      type: 'paragraphs',
      amount: 3,
      format: 'html',
      startWithLorem: true
    });
    
    expect(text.includes('<p>')).toBe(true);
    const matches = text.match(/<p>/g);
    expect(matches?.length).toBe(3);
  });
});
