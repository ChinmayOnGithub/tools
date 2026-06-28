/**
 * Returns height calculated from width keeping aspect ratio.
 */
export function getProportionalHeight(
  origWidth: number,
  origHeight: number,
  newWidth: number
): number {
  if (origWidth <= 0 || origHeight <= 0 || newWidth <= 0) return 0;
  return Math.round((origHeight / origWidth) * newWidth);
}

/**
 * Returns width calculated from height keeping aspect ratio.
 */
export function getProportionalWidth(
  origWidth: number,
  origHeight: number,
  newHeight: number
): number {
  if (origWidth <= 0 || origHeight <= 0 || newHeight <= 0) return 0;
  return Math.round((origWidth / origHeight) * newHeight);
}
