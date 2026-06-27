import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { mergePdfBuffers } from './utils';

describe('mergePdfBuffers', () => {
  it('should successfully merge multiple single-page PDFs into one combined document', async () => {
    // Programmatically construct two dummy PDFs
    const doc1 = await PDFDocument.create();
    doc1.addPage([300, 400]);
    const pdf1Bytes = await doc1.save();

    const doc2 = await PDFDocument.create();
    doc2.addPage([500, 600]);
    const pdf2Bytes = await doc2.save();

    const mergedBytes = await mergePdfBuffers([pdf1Bytes, pdf2Bytes]);
    
    expect(mergedBytes).toBeInstanceOf(Uint8Array);
    expect(mergedBytes.length).toBeGreaterThan(0);

    // Verify merged document pages count
    const mergedDoc = await PDFDocument.load(mergedBytes);
    expect(mergedDoc.getPageCount()).toBe(2);
  });

  it('should throw an error when empty array is passed', async () => {
    await expect(mergePdfBuffers([])).rejects.toThrow('No PDF buffers provided');
  });

  it('should throw an error for invalid document contents', async () => {
    const invalidBuffer = new Uint8Array([0, 1, 2, 3]);
    await expect(mergePdfBuffers([invalidBuffer])).rejects.toThrow('Failed to parse PDF document at index 0');
  });
});
