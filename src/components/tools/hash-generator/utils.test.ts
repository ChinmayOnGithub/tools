import { describe, it, expect } from 'vitest';
import { generateHash } from './utils';

describe('Hash Generator utilities', () => {
  it('correctly calculates MD5 hashes in pure JS', async () => {
    const hash = await generateHash('hello', 'MD5');
    expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('correctly calculates SHA-256 hashes using Web Crypto subtle', async () => {
    const hash = await generateHash('hello', 'SHA-256');
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('correctly calculates SHA-512 hashes using Web Crypto subtle', async () => {
    const hash = await generateHash('hello', 'SHA-512');
    expect(hash).toBe('9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043');
  });

  it('throws error for unsupported algorithms', async () => {
    await expect(generateHash('hello', 'UNSUPPORTED')).rejects.toThrow('Unsupported hash algorithm');
  });
});
