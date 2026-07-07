'use client';

import { useState, useEffect, useMemo } from 'react';
import t from './locales/en.json';
import { encodeURLString, decodeURLString } from './utils';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextInputArea } from '@/components/ui/TextInputArea';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError 
} from '@/lib/analytics';
import { Link2, Unlink } from 'lucide-react';

export default function URLEncoder() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [queryOnly, setQueryOnly] = useState(false);
  
  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('url-encoder');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce conversion event tracking
  useEffect(() => {
    if (!input.trim()) return;

    const timer = setTimeout(() => {
      if (mode === 'encode') {
        trackToolCompletion('url-encoder');
      } else {
        const result = decodeURLString(input);
        if (result.success) {
          trackToolCompletion('url-encoder');
        } else {
          trackValidationError('url-encoder', 'decode_failed');
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [input, mode]);

  // Compute outputs and errors using useMemo for performance
  const { output, errorMsg } = useMemo(() => {
    let outputVal = '';
    let errorVal: string | null = null;

    if (input.length > 2000000) {
      errorVal = 'Input size exceeds maximum limit of 2MB. Please enter a smaller URL string.';
    } else if (input.trim()) {
      if (mode === 'encode') {
        outputVal = encodeURLString(input, queryOnly);
      } else {
        const result = decodeURLString(input);
        if (result.success) {
          outputVal = result.output;
        } else {
          errorVal = t.validationError.replace('{message}', result.error || 'Invalid string');
        }
      }
    }

    return { output: outputVal, errorMsg: errorVal };
  }, [input, mode, queryOnly]);

  const handleClear = () => {
    setInput('');
  };

  const handleLoadSample = () => {
    if (mode === 'encode') {
      setInput('https://tools.chinmaypatil.com/search?query=json formatter & validator=true');
    } else {
      setInput('https%3A%2F%2Ftools.chinmaypatil.com%2Fsearch%3Fquery%3Djson%20formatter%20%26%20validator%3Dtrue');
    }
  };

  const processUploadedFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  const controlOptions = [
    { value: 'encode' as const, label: t.encodeButton, icon: <Link2 className="h-4 w-4" /> },
    { value: 'decode' as const, label: t.decodeButton, icon: <Unlink className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Segmented Control Primitives */}
      <SegmentedControl
        options={controlOptions}
        value={mode}
        onChange={(val) => {
          setMode(val);
          handleClear();
        }}
      />

      {/* Configuration bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card p-3 border-2 border-border rounded-none">
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" size="sm" onClick={handleLoadSample} className="rounded-none border-2">
            Load Sample
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input} className="rounded-none border-2">
            {t.clearButton}
          </Button>

          {/* Conditional Query Param toggle */}
          {mode === 'encode' && (
            <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none ml-2 border-l-2 border-border pl-4 h-7">
              <input
                type="checkbox"
                checked={queryOnly}
                onChange={(e) => setQueryOnly(e.target.checked)}
                className="h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-primary checked:bg-primary cursor-pointer"
              />
              Encode Query Params Only
            </label>
          )}
        </div>
      </div>

      {/* Validation Message Box Banner */}
      {errorMsg && (
        <StatusBanner type="error" message={errorMsg} />
      )}

      {/* Inputs grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <TextInputArea 
          value={input}
          onChange={setInput}
          placeholder={t.placeholder}
          label={t.inputLabel}
          onFileDrop={processUploadedFile}
          rows={12}
          showStats={true}
        />

        {/* Output Card */}
        <TextInputArea 
          value={output}
          readOnly={true}
          placeholder={t.outputPlaceholder}
          label={t.outputLabel}
          rows={12}
          showStats={true}
        />
      </div>
    </div>
  );
}
