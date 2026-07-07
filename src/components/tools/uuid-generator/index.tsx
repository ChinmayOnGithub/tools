'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import t from './locales/en.json';
import { generateUUIDs, inspectUUID } from './utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { trackToolLaunch, trackToolCompletion, trackDownloadAction } from '@/lib/analytics';
import { Settings, RefreshCw, FileDown, Copy, Check, Info, LayoutGrid, Terminal } from 'lucide-react';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { downloadFile } from '@/lib/download';

export default function UUIDGenerator() {
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(5);
  const [version, setVersion] = useState<'v4' | 'v1' | 'v7'>('v4');
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [delimiter, setDelimiter] = useState<'newline' | 'comma' | 'semicolon' | 'space'>('newline');
  const [output, setOutput] = useState<string[]>([]);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [viewFormat, setViewFormat] = useState<'list' | 'raw'>('list');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const { copied, copy } = useCopyToClipboard('uuid-generator');

  const handleGenerate = useCallback(() => {
    const boundedQuantity = Math.max(1, Math.min(500, quantity));
    const list = generateUUIDs(boundedQuantity, { 
      version, 
      uppercase, 
      hyphens, 
      prefix, 
      suffix 
    });
    setOutput(list);
    if (list.length > 0) {
      setSelectedUuid(list[0]);
    } else {
      setSelectedUuid(null);
    }
    trackToolCompletion('uuid-generator');
  }, [quantity, version, uppercase, hyphens, prefix, suffix]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('uuid-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        handleGenerate();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [mounted, handleGenerate]);

  const getDelimiterChar = () => {
    switch (delimiter) {
      case 'comma': return ', ';
      case 'semicolon': return '; ';
      case 'space': return ' ';
      default: return '\n';
    }
  };

  const handleCopyAll = () => {
    if (output.length === 0) return;
    copy(output.join(getDelimiterChar()));
  };

  const handleCopyItem = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item).then(() => {
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 1000);
    });
  };

  const handleDownload = () => {
    if (output.length === 0) return;
    trackDownloadAction('uuid-generator');
    downloadFile(output.join(getDelimiterChar()), 'uuids.txt', 'text/plain');
  };

  // Inspect the currently selected UUID
  const inspection = useMemo(() => {
    if (!selectedUuid) return null;
    // Strip prefix/suffix for pure UUID inspection if added
    let pureUuid = selectedUuid;
    if (prefix && pureUuid.startsWith(prefix)) {
      pureUuid = pureUuid.slice(prefix.length);
    }
    if (suffix && pureUuid.endsWith(suffix)) {
      pureUuid = pureUuid.slice(0, pureUuid.length - suffix.length);
    }
    return inspectUUID(pureUuid);
  }, [selectedUuid, prefix, suffix]);

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-96 rounded-none w-full border-2 border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Configuration & Output Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Generator configurations */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-none border-2 border-border card-depth-2">
            <CardHeader className="py-3.5 px-4 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings className="h-4 w-4" /> Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Version selector dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="version-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  UUID Version
                </label>
                <select
                  id="version-select"
                  value={version}
                  onChange={(e) => setVersion(e.target.value as 'v4' | 'v1' | 'v7')}
                  className="w-full h-9 border-2 border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer"
                >
                  <option value="v4">Version 4 (Random)</option>
                  <option value="v7">Version 7 (Time-ordered)</option>
                  <option value="v1">Version 1 (Time &amp; Node)</option>
                </select>
              </div>

              {/* Quantity select input */}
              <div className="space-y-1.5">
                <label htmlFor="quantity" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t.quantityLabel}
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                  className="h-9 text-xs font-semibold rounded-none border-2 border-border"
                  aria-label="Quantity of UUIDs to generate"
                />
              </div>

              {/* Prefix field input */}
              <div className="space-y-1.5">
                <label htmlFor="prefix-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Prefix Text
                </label>
                <Input
                  id="prefix-input"
                  type="text"
                  placeholder="e.g. prefix_"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="h-9 text-xs font-semibold rounded-none border-2 border-border"
                  aria-label="Prefix text to prepend"
                />
              </div>

              {/* Suffix field input */}
              <div className="space-y-1.5">
                <label htmlFor="suffix-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Suffix Text
                </label>
                <Input
                  id="suffix-input"
                  type="text"
                  placeholder="e.g. _suffix"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="h-9 text-xs font-semibold rounded-none border-2 border-border"
                  aria-label="Suffix text to append"
                />
              </div>

              {/* Delimiter separator selection */}
              <div className="space-y-1.5">
                <label htmlFor="delimiter-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Delimiting Character
                </label>
                <select
                  id="delimiter-select"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value as 'newline' | 'comma' | 'semicolon' | 'space')}
                  className="w-full h-9 border-2 border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer"
                >
                  <option value="newline">New Line (\n)</option>
                  <option value="comma">Comma (,)</option>
                  <option value="semicolon">Semicolon (;)</option>
                  <option value="space">Space ( )</option>
                </select>
              </div>

              {/* Binary Switches Checkboxes */}
              <div className="flex flex-col gap-2.5 pt-2 border-t-2 border-border/40">
                <CheckboxField
                  id="opt-upper"
                  label={t.uppercaseLabel}
                  checked={uppercase}
                  onChange={setUppercase}
                />
                <CheckboxField
                  id="opt-hyphens"
                  label={t.hyphensLabel}
                  checked={hyphens}
                  onChange={setHyphens}
                />
              </div>

              <div className="pt-4 border-t-2 border-border/40">
                <Button onClick={handleGenerate} className="w-full rounded-none border-2 border-primary">
                  {t.generateButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Generated lists, toggles and inspect actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-none border-2 border-border card-depth-2">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/10 flex flex-row justify-between items-center space-y-0">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4" /> Generated Output
                </CardTitle>
                
                {/* Format toggle tabs */}
                <div className="flex border-2 border-border rounded-none overflow-hidden h-7">
                  <button
                    onClick={() => setViewFormat('list')}
                    className={`px-2.5 flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors border-r border-border ${
                      viewFormat === 'list' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <LayoutGrid className="h-3 w-3" /> List View
                  </button>
                  <button
                    onClick={() => setViewFormat('raw')}
                    className={`px-2.5 flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors ${
                      viewFormat === 'raw' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Terminal className="h-3 w-3" /> Raw Text
                  </button>
                </div>
              </div>
              
              {output.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-none border-2 h-7 text-[10px] flex items-center gap-1">
                    <FileDown className="h-3 w-3" /> Export List
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopyAll} className="rounded-none border-2 h-7 text-[10px] w-20 flex items-center justify-center gap-1">
                    <Copy className="h-3 w-3" /> {copied ? t.copiedFeedback : t.copyButton}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {viewFormat === 'raw' ? (
                <textarea
                  readOnly
                  value={output.join(getDelimiterChar())}
                  placeholder={t.placeholder}
                  rows={12}
                  className="w-full h-[320px] border-none bg-muted/10 p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
                  aria-label="Generated UUID outputs list text area"
                />
              ) : (
                <div className="h-[320px] overflow-y-auto p-3 bg-muted/5 divide-y divide-border/40 font-mono text-xs select-text">
                  {output.map((uuid, i) => (
                    <div 
                      key={i}
                      onClick={() => setSelectedUuid(uuid)}
                      className={`flex justify-between items-center py-2 px-2.5 cursor-pointer transition-colors ${
                        selectedUuid === uuid 
                          ? 'bg-primary/10 border-l-4 border-primary font-bold' 
                          : 'hover:bg-muted/40 border-l-4 border-transparent'
                      }`}
                    >
                      <span className="truncate">{uuid}</span>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={(e) => handleCopyItem(uuid, e)}
                          className="p-1 hover:text-primary transition-colors cursor-pointer"
                          title="Copy UUID"
                        >
                          {copiedItem === uuid ? <Check className="h-3.5 w-3.5 text-emerald-500 animate-in zoom-in-50 duration-200" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive UUID Metadata Inspector Panel */}
          {selectedUuid && inspection && (
            <Card className="rounded-none border-2 border-border card-depth-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <CardHeader className="py-3 px-4 border-b border-border bg-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Info className="h-4 w-4" /> UUID Metadata Inspector
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5 text-xs font-semibold">
                <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Inspected Target:</span>
                  <span className="font-mono text-foreground font-bold select-all break-all">{selectedUuid}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">UUID Version</span>
                    <p className="text-foreground text-sm font-bold font-mono">{inspection.version}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Variant Layout</span>
                    <p className="text-foreground text-sm font-bold font-mono">{inspection.variant}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Variant Details</span>
                  <p className="text-muted-foreground font-medium">{inspection.variantDesc}</p>
                </div>

                {inspection.timestamp && (
                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Extracted Timestamp (UTC)</span>
                    <p className="text-primary font-bold font-mono text-sm">{inspection.timestamp}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
