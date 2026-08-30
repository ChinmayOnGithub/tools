import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getFavorites, toggleFavorite, isFavorite, FAVORITES_KEY } from './favorites';

describe('Favorites helper', () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    const mockLocalStorage = {
      getItem: (key: string) => mockStore[key] || null,
      setItem: (key: string, value: string) => {
        mockStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
    };

    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to empty list', () => {
    expect(getFavorites()).toEqual([]);
    expect(isFavorite('json-formatter')).toBe(false);
  });

  it('toggles tool id into favorites', () => {
    const res1 = toggleFavorite('json-formatter');
    expect(res1).toBe(true);
    expect(isFavorite('json-formatter')).toBe(true);
    expect(getFavorites()).toContain('json-formatter');

    const res2 = toggleFavorite('json-formatter');
    expect(res2).toBe(false);
    expect(isFavorite('json-formatter')).toBe(false);
    expect(getFavorites()).not.toContain('json-formatter');
  });

  it('persists multiple tool ids in localStorage', () => {
    toggleFavorite('tool-a');
    toggleFavorite('tool-b');
    const stored = JSON.parse(mockStore[FAVORITES_KEY] || '[]');
    expect(stored).toEqual(['tool-a', 'tool-b']);
  });
});
