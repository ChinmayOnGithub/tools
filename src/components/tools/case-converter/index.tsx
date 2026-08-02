'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import t from './locales/en.json';
import { convertCase } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { validateFile } from '@/lib/file-processor';
import { TextInputArea } from '@/components/ui/TextInputArea';
import { 
  trackToolLaunch, 
  trackToolCompletion
} from '@/lib/analytics';
import TrustBanner from '@/components/shared/TrustBanner';

const STYLES = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence Case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'pascal', label: 'PascalCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'alternate', label: 'aLtErNaTiNg CaSe' },
  { id: 'train', label: 'Train-Case' },
  { id: 'dot', label: 'dot.case' }
];

export default function CaseConverter() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('upper');
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('case-converter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce analytics completion logs
  useEffect(() => {
    if (!input.trim() || fileError) return;

    const timer = setTimeout(() => {
      trackToolCompletion('case-converter');
    }, 1500);

    return () => clearTimeout(timer);
  }, [input, style, fileError]);

  const handleClear = () => {
    setInput('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setFileError(null);
    setInput('CoolTools is a PRIVATE browser-side tools platform. All files remain on your DEVICE.');
  };

  const processUploadedFile = (file: File) => {
    setFileError(null);

    const check = validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB limit
    });

    if (!check.isValid) {
      setFileError(check.error || 'File validation failed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const output = convertCase(input, style);

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cased_${style}_text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Trust pledge indicators banner */}
      <TrustBanner items={['100% Client-Side Casing', 'Text Never Sent to Servers', 'Free & Secure Forever']} />

      {/* Action controls panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card p-3 border-2 border-border rounded-none">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-none border-2">
            Upload Text File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.json,.md,.js,.ts"
            className="hidden"
            aria-label="Upload text file for casing conversion"
          />
          <Button variant="outline" size="sm" onClick={handleLoadSample} className="rounded-none border-2">
            {t.loadSampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input} className="rounded-none border-2">
            {t.clearButton}
          </Button>
        </div>

        {output && (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-none border-2">
              Download Output
            </Button>
          </div>
        )}
      </div>

      {/* File error notification */}
      {fileError && (
        <div className="p-3 text-xs font-semibold border-2 bg-destructive/5 text-destructive border-destructive/20 rounded-none">
          {fileError}
        </div>
      )}

      {/* Casing styles grid selector card */}
      <Card className="rounded-none border-2 border-border card-depth-2">
        <CardHeader className="py-2.5 px-4 border-b border-border bg-muted/10">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Select Casing Style
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {STYLES.map((st) => (
              <Button
                key={st.id}
                variant={style === st.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStyle(st.id)}
                className="w-full text-[10px] h-8 font-extrabold rounded-none border-2"
              >
                {st.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dual workspaces textareas grid */}
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
          placeholder="Converted casing text output will be rendered here..."
          label={t.outputLabel}
          rows={12}
          showStats={true}
        />
      </div>
    </div>
  );
}
