export interface TimestampInfo {
  isValid: boolean;
  epochSeconds: number;
  epochMilliseconds: number;
  iso8601: string;
  rfc3339: string;
  utcString: string;
  localString: string;
  relative: string;
}

export function parseEpoch(input: string): TimestampInfo {
  const cleanInput = input.trim();
  if (!cleanInput) {
    return {
      isValid: false,
      epochSeconds: 0,
      epochMilliseconds: 0,
      iso8601: '',
      rfc3339: '',
      utcString: '',
      localString: '',
      relative: '',
    };
  }

  let msValue = 0;
  // Guess if seconds or milliseconds based on length
  if (/^\d+$/.test(cleanInput)) {
    const val = parseInt(cleanInput, 10);
    if (cleanInput.length <= 10) {
      msValue = val * 1000;
    } else {
      msValue = val;
    }
  } else {
    // Attempt parsing as Date string
    const parsed = Date.parse(cleanInput);
    if (isNaN(parsed)) {
      return {
        isValid: false,
        epochSeconds: 0,
        epochMilliseconds: 0,
        iso8601: '',
        rfc3339: '',
        utcString: '',
        localString: '',
        relative: '',
      };
    }
    msValue = parsed;
  }

  const date = new Date(msValue);
  const iso = date.toISOString();

  return {
    isValid: true,
    epochSeconds: Math.floor(msValue / 1000),
    epochMilliseconds: msValue,
    iso8601: iso,
    rfc3339: iso.replace(/\.\d+Z$/, 'Z'), // Simple RFC3339 format
    utcString: date.toUTCString(),
    localString: date.toLocaleString(),
    relative: getRelativeTime(msValue),
  };
}

export function getRelativeTime(timestamp: number): string {
  const delta = timestamp - Date.now();
  const absoluteDelta = Math.abs(delta);

  const seconds = Math.floor(absoluteDelta / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const suffix = delta < 0 ? 'ago' : 'from now';

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${suffix}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${suffix}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ${suffix}`;
  return 'just now';
}
