/**
 * Formats elapsed milliseconds to a human-readable timer string (MM:SS.cc).
 * cc represents centiseconds (hundredths of a second).
 */
export function formatElapsedDuration(totalMs: number): string {
  if (totalMs < 0) return '00:00.00';

  const ms = Math.floor(totalMs % 1000);
  const totalSeconds = Math.floor(totalMs / 1000);
  
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const centiseconds = Math.floor(ms / 10);

  const hourStr = hours > 0 ? `${String(hours).padStart(2, '0')}:` : '';
  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const centiStr = String(centiseconds).padStart(2, '0');

  return `${hourStr}${minStr}:${secStr}.${centiStr}`;
}
