export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  mode?: 'password' | 'passphrase';
  wordCount?: number;
  separator?: string;
  capitalize?: boolean;
}

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,./<>?';

const SIMILAR_CHARS = /[il1Lo0OI]/g;
const AMBIGUOUS_CHARS = /[{}[\]()/\b\\'"`,;:.<>~]/g;

// Memorable curated wordlist for generating secure passphrases client-side
const PASSPHRASE_WORDS = [
  'apple', 'banana', 'orange', 'cherry', 'grape', 'melon', 'lemon', 'peach', 'plum', 'berry',
  'river', 'forest', 'desert', 'mountain', 'valley', 'ocean', 'canyon', 'island', 'jungle', 'garden',
  'bright', 'silent', 'golden', 'silver', 'copper', 'bronze', 'wooden', 'stone', 'iron', 'steel',
  'happy', 'clever', 'brave', 'gentle', 'quick', 'strong', 'noble', 'honest', 'kind', 'peaceful',
  'tiger', 'eagle', 'dolphin', 'panther', 'falcon', 'badger', 'rabbit', 'koala', 'panda', 'otter',
  'rocket', 'bridge', 'castle', 'temple', 'palace', 'station', 'harbor', 'beacon', 'anchor', 'compass'
];

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
  const mode = options.mode || 'password';

  if (mode === 'passphrase') {
    const wordCount = options.wordCount || 4;
    const separator = options.separator || '-';
    const capitalize = options.capitalize !== false;
    
    const randomInts = getRandomInts(wordCount);
    const words: string[] = [];
    
    for (let i = 0; i < wordCount; i++) {
      const wordIndex = randomInts[i] % PASSPHRASE_WORDS.length;
      let word = PASSPHRASE_WORDS[wordIndex];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      words.push(word);
    }
    return words.join(separator);
  }

  // Character Mode
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

export interface PasswordAnalysis {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  entropy: number;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export function analyzePassword(password: string, isPassphrase = false): PasswordAnalysis {
  if (!password) {
    return {
      strength: 'weak',
      entropy: 0,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSymbol: false
    };
  }

  // Calculate Entropy
  let entropy = 0;
  if (isPassphrase) {
    // Passphrase entropy based on wordlist size (60 words)
    // entropy = wordCount * log2(60) = wordCount * 5.9
    const words = password.split(/[-._ ]/);
    entropy = Math.round(words.length * Math.log2(PASSPHRASE_WORDS.length));
  } else {
    // Character entropy: length * log2(poolSize)
    let poolSize = 0;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    
    if (hasUpper) poolSize += 26;
    if (hasLower) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 28; // symbols
    
    if (poolSize > 0) {
      entropy = Math.round(password.length * Math.log2(poolSize));
    }
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
  if (entropy >= 80) {
    strength = 'very-strong';
  } else if (entropy >= 60) {
    strength = 'strong';
  } else if (entropy >= 35) {
    strength = 'medium';
  }

  return {
    strength,
    entropy,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol
  };
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' | 'very-strong' {
  return analyzePassword(password).strength;
}
