/**
 * Formats a Date object into a readable time string.
 */
export function formatTime(date: Date, showSeconds: boolean, use24Hour: boolean): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');

  let ampm = '';
  if (!use24Hour) {
    ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
  }

  const hourStr = String(hours).padStart(2, '0');
  const timeStr = showSeconds ? `${hourStr}:${minStr}:${secStr}` : `${hourStr}:${minStr}`;

  return `${timeStr}${ampm}`;
}

/**
 * Formats a Date object into a readable date string.
 */
export function formatDateString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}
