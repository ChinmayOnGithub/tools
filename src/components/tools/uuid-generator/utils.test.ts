import { describe, it, expect } from 'vitest';
import { generateSingleUUID, generateUUIDs } from './utils';

describe('UUID generator utilities', () => {
  it('generates a standard v4 UUID', () => {
    const uuid = generateSingleUUID();
    expect(uuid).toHaveLength(36);
    expect(uuid.split('-')).toHaveLength(5);
  });

  it('generates uppercase UUIDs correctly', () => {
    const uuid = generateSingleUUID({ uppercase: true });
    expect(uuid).toBe(uuid.toUpperCase());
  });

  it('removes hyphens when requested', () => {
    const uuid = generateSingleUUID({ hyphens: false });
    expect(uuid).toHaveLength(32);
    expect(uuid.includes('-')).toBe(false);
  });

  it('generates requested count of UUIDs', () => {
    const list = generateUUIDs(5);
    expect(list).toHaveLength(5);
    expect(new Set(list).size).toBe(5);
  });
});
