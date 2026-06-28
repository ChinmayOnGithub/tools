import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { imagesToPdfBuffer } from './utils';

// Standard 1x1 pixel transparent PNG bytes
const mockPngBytes = new Uint8Array([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
  0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137,
  0, 0, 0, 13, 73, 68, 65, 84, 120, 156, 99, 96, 0, 0, 0,
  2, 0, 1, 73, 175, 168, 14, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
]);

describe('imagesToPdfBuffer', () => {
  it('should successfully compile PNG image bytes into a multi-page PDF', async () => {
    const result = await imagesToPdfBuffer([
      { bytes: mockPngBytes, isPng: true },
      { bytes: mockPngBytes, isPng: true }
    ]);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);

    const pdfDoc = await PDFDocument.load(result);
    expect(pdfDoc.getPageCount()).toBe(2);
  });

  it('should throw an error when no images are provided', async () => {
    await expect(imagesToPdfBuffer([])).rejects.toThrow('No images provided');
  });

  it('should throw an error if image embedding fails', async () => {
    const invalidBytes = new Uint8Array([1, 2, 3, 4]);
    await expect(
      imagesToPdfBuffer([{ bytes: invalidBytes, isPng: true }])
    ).rejects.toThrow('Failed to embed image at index 0');
  });
});
