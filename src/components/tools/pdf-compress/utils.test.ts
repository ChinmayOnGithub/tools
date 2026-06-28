import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { compressPdfBuffer } from './utils';

describe('compressPdfBuffer', () => {
  it('should successfully optimize and re-serialize a programmatically constructed PDF', async () => {
    // Generate a basic PDF
    const doc = await PDFDocument.create();
    doc.addPage([300, 400]);
    const pdfBytes = await doc.save();

    const compressedBytes = await compressPdfBuffer(pdfBytes);
    expect(compressedBytes).toBeInstanceOf(Uint8Array);
    expect(compressedBytes.length).toBeGreaterThan(0);

    // Verify optimized document pages count
    const optimizedDoc = await PDFDocument.load(compressedBytes);
    expect(optimizedDoc.getPageCount()).toBe(1);
  });

  it('should throw an error when empty buffer is passed', async () => {
    await expect(compressPdfBuffer(new Uint8Array([]))).rejects.toThrow('PDF buffer is empty');
  });

  it('should throw an error for invalid document contents', async () => {
    const invalidBuffer = new Uint8Array([0, 1, 2, 3]);
    await expect(compressPdfBuffer(invalidBuffer)).rejects.toThrow('Failed to load or optimize PDF document');
  });
});
