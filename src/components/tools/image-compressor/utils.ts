/**
 * Calculates new width and height maintaining the aspect ratio.
 */
export function calculateAspectRatioDimensions(
  width: number,
  height: number,
  maxDim: number
): { width: number; height: number } {
  if (width <= 0 || height <= 0 || maxDim <= 0) {
    return { width, height };
  }

  if (width > maxDim || height > maxDim) {
    if (width > height) {
      const ratio = maxDim / width;
      return {
        width: maxDim,
        height: Math.round(height * ratio),
      };
    } else {
      const ratio = maxDim / height;
      return {
        width: Math.round(width * ratio),
        height: maxDim,
      };
    }
  }

  return { width, height };
}

/**
 * Formats size in bytes to human-readable strings.
 */
export function formatByteSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
