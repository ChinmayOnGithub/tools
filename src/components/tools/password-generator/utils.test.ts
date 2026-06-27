import { describe, it, expect } from 'vitest';
import { generatePassword, generateMultiplePasswords, getPasswordStrength } from './utils';

describe('Password Generator utilities', () => {
  const options = {
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  };

  it('generates password of specified length', () => {
    const pw = generatePassword(options);
    expect(pw).toHaveLength(12);
  });

  it('generates multiple passwords', () => {
    const list = generateMultiplePasswords(options, 5);
    expect(list).toHaveLength(5);
    list.forEach(pw => expect(pw).toHaveLength(12));
  });

  it('correctly reports password strengths', () => {
    expect(getPasswordStrength('abc')).toBe('weak');
    expect(getPasswordStrength('Abc12345')).toBe('medium');
    expect(getPasswordStrength('Abc12345!@#$abcdef')).toBe('very-strong');
  });

  it('excludes similar characters', () => {
    const customOptions = {
      ...options,
      length: 100,
      excludeSimilar: true,
    };
    const pw = generatePassword(customOptions);
    expect(pw).not.toMatch(/[il1Lo0OI]/);
  });
});
