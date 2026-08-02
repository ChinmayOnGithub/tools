'use client';

import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { convertUnit, CONVERSIONS } from './utils';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import PipeButton from '@/components/shared/PipeButton';
import CopyShareToast from '@/components/shared/CopyShareToast';

// Hooks
import { useUrlQueryInput } from '@/hooks/useUrlQueryInput';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';

export default function UnitConverterComponent() {
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('km');
  const [toUnit, setToUnit] = useState('m');
  const [showToast, setShowToast] = useState(false);

  const { copy } = useCopyToClipboard('unit-converter');

  // URL query parameter piping hook
  useUrlQueryInput(setInputValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('unit-converter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Track tool completion safely outside of render phase using a debounced hook
  useEffect(() => {
    if (!mounted || !inputValue.trim() || isNaN(parseFloat(inputValue))) return;

    const timer = setTimeout(() => {
      trackToolCompletion('unit-converter');
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [inputValue, category, fromUnit, toUnit, mounted]);

  // Update dropdown defaults when changing category
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat === 'temperature') {
      setFromUnit('c');
      setToUnit('f');
    } else {
      const keys = Object.keys(CONVERSIONS[cat]?.factors || {});
      setFromUnit(keys[3] || keys[0]);
      setToUnit(keys[0]);
    }
  };

  const getUnitsForCategory = () => {
    if (category === 'temperature') {
      return [
        { val: 'c', label: 'Celsius (°C)' },
        { val: 'f', label: 'Fahrenheit (°F)' },
        { val: 'k', label: 'Kelvin (K)' },
      ];
    }
    
    // Map standard factors
    const factors = CONVERSIONS[category]?.factors || {};
    return Object.keys(factors).map((key) => ({
      val: key,
      label: key.toUpperCase(),
    }));
  };

  const calculateResult = (): string => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed)) return '';

    const converted = convertUnit(category, parsed, fromUnit, toUnit);
    return String(parseFloat(converted.toFixed(6)));
  };

  const result = calculateResult();

  const handleCopyResult = () => {
    if (!result) return;
    copy(result);
    setShowToast(true);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 w-full border border-border rounded-none" />;
  }

  const categoryOptions = (
    <select
      value={category}
      onChange={(e) => handleCategoryChange(e.target.value)}
      className="h-7 border border-border px-2 bg-background text-[10px] font-bold uppercase text-foreground focus-visible:outline-none rounded-none cursor-pointer"
    >
      <option value="length">Length</option>
      <option value="weight">Weight & Mass</option>
      <option value="area">Area</option>
      <option value="volume">Volume</option>
      <option value="temperature">Temperature</option>
      <option value="speed">Speed</option>
    </select>
  );

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Input Panel */}
        <div className="space-y-6">
          <InputPanel 
            title="Convert Inputs" 
            actions={categoryOptions}
            onPasteClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                if (text && !isNaN(parseFloat(text))) {
                  setInputValue(text.trim());
                }
              } catch {
                const el = document.getElementById('value-input');
                if (el) el.focus();
              }
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="value-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Value</label>
                  <Input
                    id="value-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. 100"
                    className="h-9 text-xs font-semibold rounded-none border border-border bg-card"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="from-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From</label>
                  <select
                    id="from-select"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full h-9 border border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer"
                  >
                    {getUnitsForCategory().map((u) => (
                      <option key={u.val} value={u.val}>{u.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="to-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">To</label>
                  <select
                    id="to-select"
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full h-9 border border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer"
                  >
                    {getUnitsForCategory().map((u) => (
                      <option key={u.val} value={u.val}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </InputPanel>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          {!!result && (
            <OutputPanel title="Converted Result">
              <div className="space-y-4">
                <div className="border border-border bg-card px-4 py-6 text-center">
                  <div className="text-3xl font-mono font-bold tracking-tight text-foreground select-all break-all">
                    {result}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                    {toUnit}
                  </div>
                </div>

                <ActionBar>
                  <div className="flex gap-2">
                    <PipeButton value={result} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCopyResult}>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Result
                    </Button>
                  </div>
                </ActionBar>
              </div>
            </OutputPanel>
          )}
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="Copied conversion result to clipboard." />
    </div>
  );
}
