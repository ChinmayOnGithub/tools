import { describe, it, expect } from 'vitest';
import { sanitizeFilename, validateFile } from './file-processor';

describe('File Processor Utilities', () => {
  it('sanitizes filename characters correctly', () => {
    expect(sanitizeFilename('test/file:name*.txt')).toBe('test_file_name_.txt');
    expect(sanitizeFilename('.hidden_file')).toBe('hidden_file');
  });

  it('validates file sizes successfully', () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const check1 = validateFile(file, { maxSize: 10 });
    expect(check1.isValid).toBe(true);

    const check2 = validateFile(file, { maxSize: 2 });
    expect(check2.isValid).toBe(false);
    expect(check2.error).toContain('exceeds the maximum limit');
  });

  it('validates mime types correctly', () => {
    const file = new File(['data'], 'test.json', { type: 'application/json' });
    const check1 = validateFile(file, { allowedMimeTypes: ['application/json'] });
    expect(check1.isValid).toBe(true);

    const check2 = validateFile(file, { allowedMimeTypes: ['text/plain'] });
    expect(check2.isValid).toBe(false);
  });
});
