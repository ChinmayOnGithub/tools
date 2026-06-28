/**
 * Maps a MIME type to its standard file extension.
 */
export function mimeToExtension(mime: string): string {
  const normalized = mime.toLowerCase().trim();
  if (normalized.includes('jpeg') || normalized.includes('jpg')) {
    return 'jpg';
  }
  if (normalized.includes('png')) {
    return 'png';
  }
  if (normalized.includes('webp')) {
    return 'webp';
  }
  if (normalized.includes('gif')) {
    return 'gif';
  }
  if (normalized.includes('svg')) {
    return 'svg';
  }
  return 'bin';
}

/**
 * Maps a file extension to its corresponding MIME type.
 */
export function extensionToMime(ext: string): string {
  const normalized = ext.toLowerCase().trim();
  switch (normalized) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}
