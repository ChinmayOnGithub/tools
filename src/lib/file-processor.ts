export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]/g, '_') // Replace illegal Windows path characters
    .replace(/^\.+/, '')          // Prevent directory traversal
    .substring(0, 255);           // Truncate to safe operating system bounds
}

export function validateFile(file: File, options: FileValidationOptions = {}): { isValid: boolean; error?: string } {
  if (options.maxSize && file.size > options.maxSize) {
    const sizeInMB = (options.maxSize / (1024 * 1024)).toFixed(1);
    return { 
      isValid: false, 
      error: `File size exceeds the maximum limit of ${sizeInMB}MB.` 
    };
  }

  if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
    const mimeMatch = options.allowedMimeTypes.some((mime) => {
      if (mime.endsWith('/*')) {
        const prefix = mime.split('/')[0];
        return file.type.startsWith(prefix + '/');
      }
      return file.type === mime;
    });
    
    if (!mimeMatch) {
      return { 
        isValid: false, 
        error: `File type (${file.type || 'unknown'}) is not supported.` 
      };
    }
  }

  if (options.allowedExtensions && options.allowedExtensions.length > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const extMatch = options.allowedExtensions.some(
      (allowedExt) => allowedExt.toLowerCase().replace(/^\./, '') === ext
    );
    if (!extMatch) {
      return { 
        isValid: false, 
        error: `File extension .${ext || ''} is not supported.` 
      };
    }
  }

  return { isValid: true };
}

export function isBrowserCompatible(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    window.File &&
    window.FileReader &&
    window.FileList &&
    window.Blob
  );
}
