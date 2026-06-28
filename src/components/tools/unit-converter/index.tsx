'use client';

import { useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import t from './locales/en.json';
import { convertUnit, CONVERSIONS } from './utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';

export default function UnitConverterComponent() {
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('km');
  const [toUnit, setToUnit] = useState('m');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('unit-converter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update dropdown defaults when changing category
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat === 'temperature') {
      setFromUnit('c');
      setToUnit('f');
    } else {
      const keys = Object.keys(CONVERSIONS[cat].factors);
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
    // Track completion slightly throttled
    trackToolCompletion('unit-converter');
    return String(parseFloat(converted.toFixed(6)));
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Card className="card-depth-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            {t.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category Selector dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="category-select" className="text-xs font-bold text-muted-foreground">{t.categoryLabel}</label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full h-10 border-2 border-input px-3 bg-background text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="length">Length</option>
              <option value="weight">Weight & Mass</option>
              <option value="area">Area</option>
              <option value="volume">Volume</option>
              <option value="time">Time</option>
              <option value="speed">Speed</option>
              <option value="temperature">Temperature</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
            {/* Input card parameters */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings className="h-4 w-4" /> Input settings
              </span>

              <div className="space-y-1.5">
                <label htmlFor="val-input" className="text-xs font-bold text-muted-foreground">{t.inputValueLabel}</label>
                <Input
                  id="val-input"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-10 text-xs font-semibold"
                  aria-label="Input value for conversion"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="from-select" className="text-xs font-bold text-muted-foreground">{t.fromLabel}</label>
                <select
                  id="from-select"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full h-10 border-2 border-input px-3 bg-background text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {getUnitsForCategory().map((u) => (
                    <option key={u.val} value={u.val}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Output conversion result */}
            <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" /> Result details
              </span>

              <div className="space-y-1.5">
                <label htmlFor="res-output" className="text-xs font-bold text-muted-foreground">{t.outputValueLabel}</label>
                <Input
                  id="res-output"
                  type="text"
                  readOnly
                  value={calculateResult()}
                  className="h-10 text-xs font-bold bg-muted/20 text-primary border-primary/20"
                  aria-label="Converted output value read-only"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="to-select" className="text-xs font-bold text-muted-foreground">{t.toLabel}</label>
                <select
                  id="to-select"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full h-10 border-2 border-input px-3 bg-background text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {getUnitsForCategory().map((u) => (
                    <option key={u.val} value={u.val}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ accordion */}
      <Card className="p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-3.5 text-xs">
          {t.faq.map((item, i) => (
            <div key={i} className={i > 0 ? 'border-t pt-3' : ''}>
              <h4 className="font-bold text-foreground mb-1">{item.q}</h4>
              <p className="text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
