import { PDFDocument } from 'pdf-lib';

interface InputImage {
  bytes: Uint8Array;
  isPng: boolean;
}

/**
 * Combines multiple images into a single PDF document.
 * Each image is drawn on a separate page matching the image's dimensions.
 * @param images Array of objects containing Uint8Array image bytes and a format flag.
 * @returns Uint8Array of the generated PDF file.
 */
export async function imagesToPdfBuffer(images: InputImage[]): Promise<Uint8Array> {
  if (images.length === 0) {
    throw new Error('No images provided');
  }

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    try {
      let embeddedImage;
      if (img.isPng) {
        embeddedImage = await pdfDoc.embedPng(img.bytes);
      } else {
        embeddedImage = await pdfDoc.embedJpg(img.bytes);
      }

      const { width, height } = embeddedImage.scale(1.0);
      const page = pdfDoc.addPage([width, height]);
      
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width,
        height,
      });
    } catch {
      throw new Error(`Failed to embed image at index ${i}`);
    }
  }

  return await pdfDoc.save();
}
