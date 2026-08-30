export interface TimestampInfo {
  isValid: boolean;
  epochSeconds: number;
  epochMilliseconds: number;
  iso8601: string;
  rfc3339: string;
  rfc2822: string;
  utcString: string;
  localString: string;
  timezoneOffset: string;
  detectedUnit: 'seconds' | 'milliseconds' | 'iso-string' | 'none';
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
      rfc2822: '',
      utcString: '',
      localString: '',
      timezoneOffset: '',
      detectedUnit: 'none',
      relative: '',
    };
  }

  let msValue = 0;
  let detectedUnit: 'seconds' | 'milliseconds' | 'iso-string' | 'none' = 'none';

  // Numeric epoch timestamp handling
  if (/^-?\d+$/.test(cleanInput)) {
    const val = parseInt(cleanInput, 10);
    // 10 digits or fewer is Unix seconds (up to Nov 2286), 11+ is milliseconds
    if (cleanInput.length <= 10) {
      msValue = val * 1000;
      detectedUnit = 'seconds';
    } else {
      msValue = val;
      detectedUnit = 'milliseconds';
    }
  } else {
    // Attempt parsing as ISO / Date string
    const parsed = Date.parse(cleanInput);
    if (isNaN(parsed)) {
      return {
        isValid: false,
        epochSeconds: 0,
        epochMilliseconds: 0,
        iso8601: '',
        rfc3339: '',
        rfc2822: '',
        utcString: '',
        localString: '',
        timezoneOffset: '',
        detectedUnit: 'none',
        relative: '',
      };
    }
    msValue = parsed;
    detectedUnit = 'iso-string';
  }

  const date = new Date(msValue);
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      epochSeconds: 0,
      epochMilliseconds: 0,
      iso8601: '',
      rfc3339: '',
      rfc2822: '',
      utcString: '',
      localString: '',
      timezoneOffset: '',
      detectedUnit: 'none',
      relative: '',
    };
  }

  const iso = date.toISOString();
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const timezoneOffset = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

  return {
    isValid: true,
    epochSeconds: Math.floor(msValue / 1000),
    epochMilliseconds: msValue,
    iso8601: iso,
    rfc3339: iso.replace(/\.\d+Z$/, 'Z'),
    rfc2822: date.toUTCString().replace('GMT', '+0000'),
    utcString: date.toUTCString(),
    localString: date.toLocaleString(),
    timezoneOffset,
    detectedUnit,
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
  if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ${suffix}`;
  return 'just now';
}
