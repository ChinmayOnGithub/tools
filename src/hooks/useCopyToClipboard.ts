import { useState, useCallback, useEffect } from 'react';

export function useCopyToClipboard(duration = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text: string) => {
    if (!navigator?.clipboard) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch {
        // Safe fallback
      }
      document.body.removeChild(textArea);
      setCopied(true);
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => setCopied(true))
      .catch(() => {
        // Safe fallback
      });
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), duration);
    return () => clearTimeout(timer);
  }, [copied, duration]);

  return { copied, copy };
}

export default useCopyToClipboard;
