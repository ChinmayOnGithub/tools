import { PDFDocument } from 'pdf-lib';

/**
 * Re-serializes a PDF document locally into next-gen object streams to reduce file size.
 * @param buffer Uint8Array of the source PDF.
 * @returns Uint8Array of the optimized PDF.
 */
export async function compressPdfBuffer(buffer: Uint8Array): Promise<Uint8Array> {
  if (buffer.length === 0) {
    throw new Error('PDF buffer is empty');
  }

  try {
    const sourceDoc = await PDFDocument.load(buffer);
    const compressedDoc = await PDFDocument.create();
    
    const pageIndices = sourceDoc.getPageIndices();
    const copiedPages = await compressedDoc.copyPages(sourceDoc, pageIndices);
    copiedPages.forEach((page) => compressedDoc.addPage(page));
    
    // Save PDF using compressed Object Streams
    return await compressedDoc.save({ useObjectStreams: true });
  } catch {
    throw new Error('Failed to load or optimize PDF document');
  }
}
