export interface UUIDOptions {
  version?: 'v4' | 'v1' | 'v7';
  uppercase?: boolean;
  hyphens?: boolean;
  prefix?: string;
  suffix?: string;
}

function generateV1(): string {
  const now = Date.now();
  const timeLow = (now & 0xffffffff).toString(16).padStart(8, '0');
  const timeMid = ((now >> 32) & 0xffff).toString(16).padStart(4, '0');
  const timeHi = (((now >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0'); // v1 indicator
  const clockSeq = ((Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, '0');
  const node = Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
}

function generateV7(): string {
  const now = Date.now();
  const timeHi = now.toString(16).padStart(12, '0'); // 48-bit timestamp
  const r1 = Math.floor(Math.random() * 0x1000).toString(16).padStart(3, '0');
  const r2 = (8 + Math.floor(Math.random() * 4)).toString(16); // variant 8-b
  const r3 = Math.floor(Math.random() * 0x1000).toString(16).padStart(3, '0');
  const r4 = Array.from({ length: 3 }, () => 
    Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
  ).join('');
  
  const part1 = timeHi.slice(0, 8);
  const part2 = timeHi.slice(8, 12);
  const part3 = '7' + r1;
  const part4 = r2 + r3;
  const part5 = r4;
  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

export function generateSingleUUID(options: UUIDOptions = {}): string {
  let uuid = '';
  const version = options.version || 'v4';

  if (version === 'v1') {
    uuid = generateV1();
  } else if (version === 'v7') {
    uuid = generateV7();
  } else {
    // Default V4
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      uuid = crypto.randomUUID();
    } else {
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }

  if (options.hyphens === false) {
    uuid = uuid.replace(/-/g, '');
  }
  
  if (options.uppercase === true) {
    uuid = uuid.toUpperCase();
  }

  // Prepend prefix and append suffix
  const prefixStr = options.prefix || '';
  const suffixStr = options.suffix || '';
  
  return `${prefixStr}${uuid}${suffixStr}`;
}

export function generateUUIDs(
  count: number,
  options: UUIDOptions = {}
): string[] {
  const quantity = Math.max(1, Math.min(count, 500));
  const results: string[] = [];
  for (let i = 0; i < quantity; i++) {
    results.push(generateSingleUUID(options));
  }
  return results;
}

export interface UUIDInspection {
  isValid: boolean;
  uuid: string;
  version: string;
  variant: string;
  variantDesc: string;
  timestamp?: string;
}

export function inspectUUID(rawUuid: string): UUIDInspection {
  const clean = rawUuid.trim().toLowerCase();
  let normalized = clean;
  if (/^[0-9a-f]{32}$/.test(clean)) {
    normalized = `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  }

  const basicRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!basicRegex.test(normalized)) {
    return {
      isValid: false,
      uuid: rawUuid,
      version: 'Unknown',
      variant: 'Unknown',
      variantDesc: 'Does not match standard UUID format.'
    };
  }

  const versionChar = normalized[14];
  const variantChar = normalized[19];

  let versionStr = `Version ${versionChar}`;
  if (versionChar === '1') versionStr += ' (Timestamp)';
  else if (versionChar === '4') versionStr += ' (Random)';
  else if (versionChar === '7') versionStr += ' (Time-ordered)';

  let variantStr = 'DCE 1.1 / RFC 4122';
  let variantDesc = 'Standard RFC-compliant UUID';
  const varVal = parseInt(variantChar, 16);
  if (varVal >= 0 && varVal <= 7) {
    variantStr = 'Apollo NCS / Variant 0';
    variantDesc = 'Backward compatibility with Apollo NCS';
  } else if (varVal >= 8 && varVal <= 11) {
    variantStr = 'DCE 1.1 / RFC 4122 / Variant 1';
    variantDesc = 'Standard layout for RFC 4122 UUIDs';
  } else if (varVal >= 12 && varVal <= 13) {
    variantStr = 'Microsoft GUID / Variant 2';
    variantDesc = 'Backward compatibility with Microsoft COM GUIDs';
  } else if (varVal >= 14) {
    variantStr = 'Reserved / Variant 3';
    variantDesc = 'Reserved for future definition';
  }

  let timestampStr: string | undefined;

  if (versionChar === '7') {
    try {
      const timeHex = normalized.replace(/-/g, '').slice(0, 12);
      const ms = parseInt(timeHex, 16);
      if (!isNaN(ms) && ms > 0) {
        timestampStr = new Date(ms).toUTCString();
      }
    } catch {
      // Ignore
    }
  } else if (versionChar === '1') {
    try {
      const parts = normalized.split('-');
      const timeLow = parts[0];
      const timeMid = parts[1];
      const timeHi = parts[2].slice(1);
      const timeHex = timeHi + timeMid + timeLow;
      const intervals = BigInt('0x' + timeHex);
      const epochOffset = BigInt('122192928000000000');
      const ms = Number((intervals - epochOffset) / BigInt(10000));
      if (!isNaN(ms) && ms > 0) {
        timestampStr = new Date(ms).toUTCString();
      }
    } catch {
      // Ignore
    }
  }

  return {
    isValid: true,
    uuid: normalized,
    version: versionStr,
    variant: variantStr,
    variantDesc,
    timestamp: timestampStr
  };
}
