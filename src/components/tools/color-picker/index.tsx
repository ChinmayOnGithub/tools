'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Settings, Sparkles } from 'lucide-react';
import t from './locales/en.json';
import { hexToRgb, rgbToHsl, generatePalettes } from './utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';

export default function ColorPickerComponent() {
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState('#6366f1'); // Indigo default
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('color-picker');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (hexVal: string) => {
    if (typeof navigator === 'undefined') return;
    navigator.clipboard.writeText(hexVal).then(() => {
      setCopiedColor(hexVal);
      trackToolCompletion('color-picker');
      setTimeout(() => setCopiedColor(null), 1500);
    });
  };

  const rgb = hexToRgb(color) || { r: 99, g: 102, b: 241 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palettes = generatePalettes(color);

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
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
          {/* Main selection swatches and native picker */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative shrink-0 flex items-center justify-center p-4 border rounded-lg bg-muted/5 w-full md:w-auto">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-28 w-28 rounded border-0 cursor-pointer shadow-md bg-transparent"
                aria-label="Color input selector box"
              />
            </div>

            {/* Readout inputs */}
            <div className="flex-1 w-full space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings className="h-4 w-4" /> {t.settingsHeader}
              </span>

              {/* HEX field */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-12 shrink-0">HEX</span>
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 text-xs font-mono"
                  aria-label="Hex color string field"
                />
                <button
                  onClick={() => copyToClipboard(color)}
                  className="h-9 w-9 border rounded flex items-center justify-center hover:bg-muted/10 cursor-pointer shrink-0 text-muted-foreground"
                  aria-label="Copy Hex value"
                >
                  {copiedColor === color ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* RGB field */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-12 shrink-0">RGB</span>
                <Input
                  type="text"
                  readOnly
                  value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                  className="h-9 text-xs font-mono bg-muted/20"
                  aria-label="RGB read-only values"
                />
                <button
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  className="h-9 w-9 border rounded flex items-center justify-center hover:bg-muted/10 cursor-pointer shrink-0 text-muted-foreground"
                  aria-label="Copy RGB value"
                >
                  {copiedColor === `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* HSL field */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-12 shrink-0">HSL</span>
                <Input
                  type="text"
                  readOnly
                  value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  className="h-9 text-xs font-mono bg-muted/20"
                  aria-label="HSL read-only values"
                />
                <button
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                  className="h-9 w-9 border rounded flex items-center justify-center hover:bg-muted/10 cursor-pointer shrink-0 text-muted-foreground"
                  aria-label="Copy HSL value"
                >
                  {copiedColor === `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Palette Harmonies display list */}
          <div className="space-y-4 border-t pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Color harmonies
            </span>

            <div className="space-y-4">
              {/* Complementary palette */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground block">{t.paletteComplementary}</span>
                <div className="flex rounded-lg overflow-hidden h-10 border">
                  {palettes.complementary.map((hexCode, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyToClipboard(hexCode)}
                      style={{ backgroundColor: hexCode }}
                      className="flex-1 h-full cursor-pointer hover:opacity-90 active:opacity-100 transition-opacity flex items-center justify-center group"
                      aria-label={`Copy color ${hexCode}`}
                    >
                      <span className="text-[9px] font-bold text-white px-2 py-0.5 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === hexCode ? 'Copied!' : hexCode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analogous palette */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground block">{t.paletteAnalogous}</span>
                <div className="flex rounded-lg overflow-hidden h-10 border">
                  {palettes.analogous.map((hexCode, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyToClipboard(hexCode)}
                      style={{ backgroundColor: hexCode }}
                      className="flex-1 h-full cursor-pointer hover:opacity-90 active:opacity-100 transition-opacity flex items-center justify-center group"
                      aria-label={`Copy color ${hexCode}`}
                    >
                      <span className="text-[9px] font-bold text-white px-2 py-0.5 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === hexCode ? 'Copied!' : hexCode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Triadic palette */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground block">{t.paletteTriadic}</span>
                <div className="flex rounded-lg overflow-hidden h-10 border">
                  {palettes.triadic.map((hexCode, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyToClipboard(hexCode)}
                      style={{ backgroundColor: hexCode }}
                      className="flex-1 h-full cursor-pointer hover:opacity-90 active:opacity-100 transition-opacity flex items-center justify-center group"
                      aria-label={`Copy color ${hexCode}`}
                    >
                      <span className="text-[9px] font-bold text-white px-2 py-0.5 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === hexCode ? 'Copied!' : hexCode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Monochromatic palette */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground block">{t.paletteMonochromatic}</span>
                <div className="flex rounded-lg overflow-hidden h-10 border">
                  {palettes.monochromatic.map((hexCode, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyToClipboard(hexCode)}
                      style={{ backgroundColor: hexCode }}
                      className="flex-1 h-full cursor-pointer hover:opacity-90 active:opacity-100 transition-opacity flex items-center justify-center group"
                      aria-label={`Copy color ${hexCode}`}
                    >
                      <span className="text-[9px] font-bold text-white px-2 py-0.5 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === hexCode ? 'Copied!' : hexCode}
                      </span>
                    </button>
                  ))}
                </div>
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
