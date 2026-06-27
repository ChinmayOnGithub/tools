import { PDFDocument } from 'pdf-lib';

/**
 * Parses page range string expressions (e.g. "1-3, 5, 8-10") into sorted 0-indexed page indices.
 * @param rangeStr The user input range string.
 * @param maxPages Total pages in the source document.
 * @returns Sorted array of unique 0-indexed page indices.
 */
export function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === '') continue;

    if (trimmed.includes('-')) {
      const bounds = trimmed.split('-');
      if (bounds.length !== 2) {
        throw new Error('Invalid range format');
      }
      const start = parseInt(bounds[0].trim(), 10);
      const end = parseInt(bounds[1].trim(), 10);

      if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end || start > maxPages || end > maxPages) {
        throw new Error('Page index out of bounds or invalid range');
      }

      for (let i = start; i <= end; i++) {
        pages.add(i - 1); // Convert to 0-indexed
      }
    } else {
      const val = parseInt(trimmed, 10);
      if (isNaN(val) || val < 1 || val > maxPages) {
        throw new Error('Page index out of bounds or invalid page number');
      }
      pages.add(val - 1); // Convert to 0-indexed
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Extracts specific pages from a PDF file buffer into a new PDF document.
 * @param buffer Source PDF Uint8Array.
 * @param pageIndices 0-indexed page numbers to copy.
 * @returns Uint8Array of the new sub-document.
 */
export async function splitPdfBuffer(buffer: Uint8Array, pageIndices: number[]): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error('No pages selected for extraction');
  }

  const sourceDoc = await PDFDocument.load(buffer);
  const splitDoc = await PDFDocument.create();

  const copiedPages = await splitDoc.copyPages(sourceDoc, pageIndices);
  copiedPages.forEach((page) => splitDoc.addPage(page));

  return await splitDoc.save();
}
