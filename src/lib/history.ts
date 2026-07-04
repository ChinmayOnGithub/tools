export interface HistoryEntry {
  id: string;
  toolId: string;
  toolName: string;
  action: string;
  timestamp: number;
  details?: string;
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('tool_history');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse history:', e);
    return [];
  }
}

export function addHistoryEntry(toolId: string, toolName: string, action: string, details?: string) {
  if (typeof window === 'undefined') return;
  try {
    const list = getHistory();
    const entry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      toolId,
      toolName,
      action,
      timestamp: Date.now(),
      details: details ? details.substring(0, 10000) : undefined // Limit stored payload size for performance
    };
    
    // De-duplicate: don't add the exact same action if it was just added in the last 2 seconds
    if (list.length > 0) {
      const last = list[0];
      if (
        last.toolId === toolId && 
        last.action === action && 
        Date.now() - last.timestamp < 2000
      ) {
        return;
      }
    }

    const updated = [entry, ...list].slice(0, 50); // Keep max 50 items to keep localStorage light
    localStorage.setItem('tool_history', JSON.stringify(updated));
    window.dispatchEvent(new Event('tool_history_update'));
  } catch (e) {
    console.error('Failed to save history entry:', e);
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('tool_history');
    window.dispatchEvent(new Event('tool_history_update'));
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}
