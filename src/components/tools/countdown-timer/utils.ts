interface TimeFields {
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates total seconds from time fields.
 */
export function timeFieldsToSeconds(fields: TimeFields): number {
  const h = Math.max(0, fields.hours);
  const m = Math.max(0, fields.minutes);
  const s = Math.max(0, fields.seconds);
  return h * 3600 + m * 60 + s;
}

/**
 * Deconstructs total seconds into time fields.
 */
export function secondsToTimeFields(totalSecs: number): TimeFields {
  if (totalSecs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  return { hours, minutes, seconds };
}
