export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,./<>?';

const SIMILAR_CHARS = /[il1Lo0OI]/g;
const AMBIGUOUS_CHARS = /[{}[\]()/\b\\'"`,;:.<>~]/g;

export function getRandomInts(count: number): Uint32Array {
  const arr = new Uint32Array(count);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(arr);
  } else {
    // Node.js unit tests dynamic fallback
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    const bytes = crypto.randomBytes(count * 4);
    for (let i = 0; i < count; i++) {
      arr[i] = bytes.readUInt32LE(i * 4);
    }
  }
  return arr;
}

export function generatePassword(options: PasswordOptions): string {
  let uppercasePool = UPPERCASE_CHARS;
  let lowercasePool = LOWERCASE_CHARS;
  let numberPool = NUMBER_CHARS;
  let symbolPool = SYMBOL_CHARS;

  if (options.excludeSimilar) {
    uppercasePool = uppercasePool.replace(SIMILAR_CHARS, '');
    lowercasePool = lowercasePool.replace(SIMILAR_CHARS, '');
    numberPool = numberPool.replace(SIMILAR_CHARS, '');
    symbolPool = symbolPool.replace(SIMILAR_CHARS, '');
  }

  if (options.excludeAmbiguous) {
    uppercasePool = uppercasePool.replace(AMBIGUOUS_CHARS, '');
    lowercasePool = lowercasePool.replace(AMBIGUOUS_CHARS, '');
    numberPool = numberPool.replace(AMBIGUOUS_CHARS, '');
    symbolPool = symbolPool.replace(AMBIGUOUS_CHARS, '');
  }

  let pool = '';
  if (options.uppercase) pool += uppercasePool;
  if (options.lowercase) pool += lowercasePool;
  if (options.numbers) pool += numberPool;
  if (options.symbols) pool += symbolPool;

  if (!pool) return '';

  const randomInts = getRandomInts(options.length);
  const passwordArray: string[] = [];

  for (let i = 0; i < options.length; i++) {
    const charIndex = randomInts[i] % pool.length;
    passwordArray.push(pool[charIndex]);
  }

  return passwordArray.join('');
}

export function generateMultiplePasswords(options: PasswordOptions, count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(generatePassword(options));
  }
  return result;
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' | 'very-strong' {
  if (password.length === 0) return 'weak';

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let typeCount = 0;
  if (hasUpper) typeCount++;
  if (hasLower) typeCount++;
  if (hasNumber) typeCount++;
  if (hasSymbol) typeCount++;

  score += typeCount;

  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  if (score <= 6) return 'strong';
  return 'very-strong';
}
