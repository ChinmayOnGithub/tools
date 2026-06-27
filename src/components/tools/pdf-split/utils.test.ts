import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { parsePageRanges, splitPdfBuffer } from './utils';

describe('PDF Range Parser & Splitter', () => {
  describe('parsePageRanges', () => {
    it('should successfully parse valid ranges and single pages', () => {
      const result = parsePageRanges('1-3, 5, 7-8', 10);
      // Expected: 0, 1, 2, 4, 6, 7 (0-indexed)
      expect(result).toEqual([0, 1, 2, 4, 6, 7]);
    });

    it('should throw error if range start > end', () => {
      expect(() => parsePageRanges('3-1', 10)).toThrow('Page index out of bounds or invalid range');
    });

    it('should throw error if index exceeds maxPages limit', () => {
      expect(() => parsePageRanges('1-12', 10)).toThrow('Page index out of bounds or invalid range');
    });

    it('should throw error if invalid character formats are passed', () => {
      expect(() => parsePageRanges('abc', 10)).toThrow();
    });
  });

  describe('splitPdfBuffer', () => {
    it('should extract target pages into a new PDF document', async () => {
      // Create a dummy 5-page PDF
      const doc = await PDFDocument.create();
      doc.addPage([100, 100]);
      doc.addPage([200, 200]);
      doc.addPage([300, 300]);
      doc.addPage([400, 400]);
      doc.addPage([500, 500]);
      const pdfBytes = await doc.save();

      // Extract pages 1 and 3 (0-indexed: 0, 2)
      const extractedBytes = await splitPdfBuffer(pdfBytes, [0, 2]);
      
      expect(extractedBytes).toBeInstanceOf(Uint8Array);
      expect(extractedBytes.length).toBeGreaterThan(0);

      const splitDoc = await PDFDocument.load(extractedBytes);
      expect(splitDoc.getPageCount()).toBe(2);
    });
  });
});
