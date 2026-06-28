/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument } from 'pdf-lib';

// Dynamically import PDF.js only in browser to prevent SSR build crashes
let pdfjsLib: any = null;
if (typeof window !== 'undefined') {
  // Use dynamic require or standard import resolved in browser
  pdfjsLib = require('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

export interface PDFPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  hasText: boolean;
}

export interface PDFMetadataInfo {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

/**
 * Validates a PDF file.
 */
export function validatePdfFile(file: File, maxSize?: number): { isValid: boolean; error?: string } {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'File is not a valid PDF document.' };
  }
  if (maxSize && file.size > maxSize) {
    const sizeInMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { isValid: false, error: `File size exceeds the maximum limit of ${sizeInMB}MB.` };
  }
  return { isValid: true };
}

/**
 * Parses page range string expressions (e.g. "1-3, 5, 8-10") into sorted 0-indexed page indices.
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
        throw new Error('Invalid range format (e.g. use "1-3")');
      }
      const start = parseInt(bounds[0].trim(), 10);
      const end = parseInt(bounds[1].trim(), 10);

      if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end || start > maxPages || end > maxPages) {
        throw new Error('Page range out of bounds or invalid format');
      }

      for (let i = start; i <= end; i++) {
        pages.add(i - 1); // 0-indexed
      }
    } else {
      const val = parseInt(trimmed, 10);
      if (isNaN(val) || val < 1 || val > maxPages) {
        throw new Error(`Invalid page number: ${trimmed}`);
      }
      pages.add(val - 1); // 0-indexed
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Loads a PDF.js document from a binary buffer.
 */
export async function loadPdfJsDoc(buffer: Uint8Array): Promise<any> {
  if (!pdfjsLib) {
    throw new Error('PDF.js is not loaded or is running server-side');
  }
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  return await loadingTask.promise;
}

/**
 * Extracts page dimensions and checks if pages have a text layer.
 */
export async function getPdfPagesInfo(
  buffer: Uint8Array,
  cancellationToken = { isCancelled: false }
): Promise<PDFPageInfo[]> {
  const pdf = await loadPdfJsDoc(buffer);
  const totalPages = pdf.numPages;
  const pageInfos: PDFPageInfo[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (cancellationToken.isCancelled) {
      throw new Error('Operation cancelled by user');
    }
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();
    const hasText = textContent.items.length > 0;

    pageInfos.push({
      pageNumber: i,
      width: viewport.width,
      height: viewport.height,
      hasText,
    });
  }

  return pageInfos;
}

/**
 * Renders a PDF page to an HTMLCanvasElement using PDF.js.
 */
export async function renderPdfPageToCanvas(
  pdfDoc: any,
  pageNum: number,
  scale = 1.5,
  cancellationToken = { isCancelled: false }
): Promise<HTMLCanvasElement> {
  if (cancellationToken.isCancelled) {
    throw new Error('Operation cancelled');
  }

  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to create canvas context');
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  return canvas;
}

/**
 * Generates a JPEG data URL thumbnail of a specific page.
 */
export async function getPdfPageThumbnail(
  buffer: Uint8Array,
  pageNum = 1,
  scale = 0.35,
  cancellationToken = { isCancelled: false }
): Promise<string> {
  const pdfDoc = await loadPdfJsDoc(buffer);
  const canvas = await renderPdfPageToCanvas(pdfDoc, pageNum, scale, cancellationToken);
  return canvas.toDataURL('image/jpeg', 0.8);
}


/**
 * Downloads a binary buffer as a PDF file.
 */
export function downloadPdfBuffer(buffer: Uint8Array, filename: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([buffer as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Extracts metadata from a PDF.
 */
export async function getPdfMetadata(buffer: Uint8Array): Promise<PDFMetadataInfo> {
  const doc = await PDFDocument.load(buffer, { updateMetadata: false });
  return {
    title: doc.getTitle(),
    author: doc.getAuthor(),
    subject: doc.getSubject(),
    creator: doc.getCreator(),
    producer: doc.getProducer(),
    creationDate: doc.getCreationDate(),
    modificationDate: doc.getModificationDate(),
  };
}

/**
 * Updates metadata for a PDF and returns the updated PDF bytes.
 */
export async function updatePdfMetadata(buffer: Uint8Array, metadata: PDFMetadataInfo): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer);
  
  if (metadata.title !== undefined) doc.setTitle(metadata.title);
  if (metadata.author !== undefined) doc.setAuthor(metadata.author);
  if (metadata.subject !== undefined) doc.setSubject(metadata.subject);
  if (metadata.creator !== undefined) doc.setCreator(metadata.creator);
  if (metadata.producer !== undefined) doc.setProducer(metadata.producer);
  if (metadata.creationDate !== undefined) doc.setCreationDate(metadata.creationDate);
  if (metadata.modificationDate !== undefined) doc.setModificationDate(metadata.modificationDate);
  
  return await doc.save();
}
