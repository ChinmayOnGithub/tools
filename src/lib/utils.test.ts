import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('combines class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('merges overlapping tailwind classes correctly', () => {
    expect(cn('p-4 p-6')).toBe('p-6');
    expect(cn('bg-red-500 bg-blue-500')).toBe('bg-blue-500');
  });

  it('handles conditional classes correctly', () => {
    expect(cn('p-4', false && 'text-white', true && 'font-bold')).toBe('p-4 font-bold');
  });
});
