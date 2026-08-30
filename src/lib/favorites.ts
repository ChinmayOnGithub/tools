export const FAVORITES_KEY = 'cooltools_favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(toolId: string): boolean {
  const favs = getFavorites();
  return favs.includes(toolId);
}

export function toggleFavorite(toolId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favs = getFavorites();
    const exists = favs.includes(toolId);
    const updated = exists ? favs.filter((id) => id !== toolId) : [...favs, toolId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cooltools_favorites_update'));
    return !exists;
  } catch {
    return false;
  }
}
