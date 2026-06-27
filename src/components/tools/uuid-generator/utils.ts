export function generateSingleUUID(options: { uppercase?: boolean; hyphens?: boolean } = {}): string {
  let uuid = '';
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    uuid = crypto.randomUUID();
  } else {
    // RFC4122 v4 math fallback for node environment validations
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  if (options.hyphens === false) {
    uuid = uuid.replace(/-/g, '');
  }
  if (options.uppercase === true) {
    uuid = uuid.toUpperCase();
  }
  return uuid;
}

export function generateUUIDs(
  count: number,
  options: { uppercase?: boolean; hyphens?: boolean } = {}
): string[] {
  const quantity = Math.max(1, Math.min(count, 500));
  const results: string[] = [];
  for (let i = 0; i < quantity; i++) {
    results.push(generateSingleUUID(options));
  }
  return results;
}
