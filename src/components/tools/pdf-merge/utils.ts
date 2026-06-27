import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDF file buffers into a single PDF document client-side.
 * @param buffers Array of Uint8Arrays representing individual PDF files in desired order.
 * @returns Uint8Array containing the merged PDF file contents.
 */
export async function mergePdfBuffers(buffers: Uint8Array[]): Promise<Uint8Array> {
  if (buffers.length === 0) {
    throw new Error('No PDF buffers provided');
  }

  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < buffers.length; i++) {
    try {
      const sourceDoc = await PDFDocument.load(buffers[i]);
      const pageIndices = sourceDoc.getPageIndices();
      const copiedPages = await mergedDoc.copyPages(sourceDoc, pageIndices);
      copiedPages.forEach((page) => mergedDoc.addPage(page));
    } catch {
      throw new Error(`Failed to parse PDF document at index ${i}`);
    }
  }

  return await mergedDoc.save();
}
