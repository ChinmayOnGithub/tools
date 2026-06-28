/**
 * Validates text content based on selected barcode format requirements.
 */
export function validateBarcodeContent(format: string, text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const normalizedFormat = format.toUpperCase();

  if (normalizedFormat === 'EAN13') {
    // EAN13 must have 12 or 13 numeric digits
    return /^\d{12,13}$/.test(trimmed);
  }

  if (normalizedFormat === 'EAN8') {
    // EAN8 must have 7 or 8 numeric digits
    return /^\d{7,8}$/.test(trimmed);
  }

  if (normalizedFormat === 'UPC') {
    // UPC-A must have 11 or 12 numeric digits
    return /^\d{11,12}$/.test(trimmed);
  }

  // CODE128 allows any ASCII values
  return true;
}
