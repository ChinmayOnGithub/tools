'use client';

import { useState } from 'react';
import { ShieldAlert, Cpu, HardDrive, WifiOff, FileCode, CheckCircle, ChevronDown, Award, Check } from 'lucide-react';

interface ToolCapabilityInfo {
  apis: string[];
  storage: string;
  offline: boolean;
  network: string;
  dragDrop: boolean;
  standards?: string[];
  compatibility?: string[];
}

const TOOL_CAPABILITIES_MAP: Record<string, ToolCapabilityInfo> = {
  'uuid-generator': {
    apis: ['Web Crypto API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
    standards: ['RFC 4122'],
    compatibility: ['Chrome 80+', 'Firefox 75+', 'Safari 14+'],
  },
  'json-formatter': {
    apis: ['Clipboard API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
    standards: ['RFC 8259', 'ECMA-404'],
    compatibility: ['Chrome 80+', 'Firefox 75+', 'Safari 14+'],
  },
  'word-counter': {
    apis: ['Clipboard API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'base64-converter': {
    apis: ['File Reader API', 'Blob URL API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
    standards: ['RFC 4648'],
    compatibility: ['Chrome 80+', 'Firefox 75+', 'Safari 14+'],
  },
  'url-encoder': {
    apis: ['Clipboard API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'password-generator': {
    apis: ['Web Crypto API', 'Clipboard API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'jwt-decoder': {
    apis: ['Web Crypto API', 'Clipboard API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
    standards: ['RFC 7519'],
    compatibility: ['Chrome 80+', 'Firefox 75+', 'Safari 14+'],
  },
  'hash-generator': {
    apis: ['Web Crypto API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'case-converter': {
    apis: ['Clipboard API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'remove-duplicate-lines': {
    apis: ['Clipboard API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'lorem-ipsum-generator': {
    apis: ['Clipboard API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'pomodoro-timer': {
    apis: ['Web Notification API', 'Audio Context API'],
    storage: 'LocalStorage',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'pdf-merge': {
    apis: ['pdf-lib', 'File Reader API', 'Blob URL API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'pdf-split': {
    apis: ['pdf-lib', 'File Reader API', 'Blob URL API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'images-to-pdf': {
    apis: ['pdf-lib', 'Canvas API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'pdf-compress': {
    apis: ['pdf-lib', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'image-compressor': {
    apis: ['Canvas API', 'Blob URL API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'image-resizer': {
    apis: ['Canvas API', 'Blob URL API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'image-format-converter': {
    apis: ['Canvas API', 'Blob URL API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'image-cropper': {
    apis: ['Canvas API', 'Blob URL API', 'File Reader API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'fullscreen-clock': {
    apis: ['RequestAnimationFrame API'],
    storage: 'LocalStorage',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'stopwatch': {
    apis: ['Performance Timer API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'countdown-timer': {
    apis: ['Audio Context API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'qr-generator': {
    apis: ['Canvas API', 'Blob URL API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'barcode-generator': {
    apis: ['Canvas API', 'Blob URL API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'color-picker': {
    apis: ['Canvas API', 'EyeDropper API'],
    storage: 'LocalStorage',
    offline: true,
    network: 'Not Required',
    dragDrop: true,
  },
  'unit-converter': {
    apis: ['Clipboard API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
  },
  'timestamp-explorer': {
    apis: ['Clipboard API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
    standards: ['ISO 8601', 'RFC 3339'],
    compatibility: ['Chrome 80+', 'Firefox 75+', 'Safari 14+'],
  },
  'unicode-inspector': {
    apis: ['Clipboard API'],
    storage: 'None',
    offline: true,
    network: 'Not Required',
    dragDrop: false,
    standards: ['Unicode 15.0', 'UTF-8'],
    compatibility: ['Chrome 80+', 'Firefox 75+', 'Safari 14+'],
  },
};

const DEFAULT_CAPABILITY: ToolCapabilityInfo = {
  apis: ['Web Browsing APIs'],
  storage: 'None',
  offline: true,
  network: 'Not Required',
  dragDrop: false,
};

interface PrivacyCardProps {
  toolId: string;
}

export default function PrivacyCard({ toolId }: PrivacyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const caps = TOOL_CAPABILITIES_MAP[toolId] || DEFAULT_CAPABILITY;

  return (
    <div className="bg-card border-2 border-border p-4 card-depth-1 transition-all duration-200">
      {/* Accordion Toggle Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 p-1 border border-transparent rounded-none"
        aria-expanded={isExpanded}
        aria-label="Toggle Privacy &amp; Sandbox Details"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-foreground leading-none">
              Privacy &amp; Sandbox Inspect
            </span>
            <span className="text-[9px] font-bold text-emerald-500 mt-0.5 leading-none">
              100% Local Browser Compute
            </span>
          </div>
        </div>
        <ChevronDown className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Collapsible Details Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t-2 border-border space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Grid of specifications */}
          <div className="space-y-3.5 text-xs">
            {/* Computing Method */}
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" /> Computing
              </span>
              <span className="font-extrabold text-foreground text-right">
                100% Client-Side
              </span>
            </div>

            {/* APIs used */}
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5" /> Browser APIs
              </span>
              <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                {caps.apis.map((api) => (
                  <span
                    key={api}
                    className="text-[9px] font-bold px-1.5 py-0.5 bg-muted border border-border text-foreground"
                  >
                    {api}
                  </span>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5" /> Local Storage
              </span>
              <span className="font-bold text-foreground">{caps.storage}</span>
            </div>

            {/* Offline usage */}
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <WifiOff className="h-3.5 w-3.5" /> Offline Mode
              </span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 fill-emerald-500/10" /> Supported
              </span>
            </div>

            {/* Network requirement */}
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" /> Data Uploads
              </span>
              <span className="font-extrabold text-emerald-500">
                Block / None
              </span>
            </div>

            {/* Standards Verified */}
            {caps.standards && (
              <div className="flex justify-between items-start pt-2 border-t border-border/40">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" /> Verified Specs
                </span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                  {caps.standards.map((spec) => (
                    <span key={spec} className="text-[9px] font-extrabold px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary uppercase">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Browser Compatibility */}
            {caps.compatibility && (
              <div className="flex justify-between items-start pt-2 border-t border-border/40">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Compatibility
                </span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[60%] text-right font-bold text-foreground text-[10px]">
                  {caps.compatibility.join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* Feature Capabilities list */}
          <div className="border-t border-border/60 pt-3 flex flex-wrap gap-1.5">
            <span className="text-[9px] font-extrabold tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 uppercase">
              Privacy Verified
            </span>
            {caps.dragDrop && (
              <span className="text-[9px] font-extrabold tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 uppercase">
                Drag &amp; Drop
              </span>
            )}
            <span className="text-[9px] font-extrabold tracking-wider bg-muted text-muted-foreground border border-border px-2 py-0.5 uppercase">
              Mobile Ready
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
