'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';

interface TreeViewProps {
  data: unknown;
}

export function TreeView({ data }: TreeViewProps) {
  const [expandAllKey, setExpandAllKey] = useState(0);

  const handleExpandAll = () => {
    setExpandAllKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 border-b border-border bg-muted/10">
        <button
          onClick={handleExpandAll}
          className="px-2 py-1 text-[10px] font-bold border border-border hover:border-primary bg-background cursor-pointer hover:text-primary transition-colors rounded-none"
        >
          Reset / Expand All
        </button>
      </div>
      <div className="p-4 font-mono text-xs overflow-auto select-text flex-1 bg-muted/5 min-h-[300px] h-[400px]">
        <TreeNode key={expandAllKey} label="root" value={data} depth={0} initiallyExpanded={true} />
      </div>
    </div>
  );
}

interface TreeNodeProps {
  label: string | number;
  value: unknown;
  depth: number;
  initiallyExpanded: boolean;
}

function TreeNode({ label, value, depth, initiallyExpanded }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedVal, setCopiedVal] = useState(false);

  const handleCopy = (text: string, isVal: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      if (isVal) {
        setCopiedVal(true);
        setTimeout(() => setCopiedVal(false), 1200);
      } else {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 1200);
      }
    });
  };

  const isObject = value !== null && typeof value === 'object';
  
  if (isObject) {
    const keys = Object.keys(value as object);
    const isArray = Array.isArray(value);
    const displayLabel = isArray ? `Array[${keys.length}]` : `Object {${keys.length}}`;

    return (
      <div className="my-0.5 group">
        <div 
          className="inline-flex items-center gap-1 hover:bg-muted/50 px-1 py-0.5 font-bold text-foreground cursor-pointer rounded-none text-left"
          style={{ marginLeft: `${depth * 14}px` }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          
          <span className="text-primary font-bold">{label}:</span>
          <span className="text-muted-foreground text-[10px] font-normal italic ml-1 mr-2">{displayLabel}</span>
          
          {/* Hover copy node structure button */}
          <button
            onClick={(e) => handleCopy(JSON.stringify(value, null, 2), true, e)}
            className="opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity p-0.5 cursor-pointer"
            title="Copy node JSON"
            aria-label="Copy node JSON structure"
          >
            {copiedVal ? <Check className="h-3 w-3 text-emerald-500 animate-in zoom-in-50 duration-200" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>

        {isExpanded && (
          <div className="border-l border-border/40 ml-2 mt-0.5">
            {keys.map((key) => {
              const childVal = (value as Record<string, unknown>)[key];
              return (
                <TreeNode
                  key={key}
                  label={isArray ? parseInt(key, 10) : key}
                  value={childVal}
                  depth={depth + 1}
                  initiallyExpanded={initiallyExpanded}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Primitive Values
  let valueColor = 'text-emerald-600 dark:text-emerald-400';
  let displayValue = String(value);

  if (typeof value === 'string') {
    valueColor = 'text-amber-600 dark:text-amber-400 font-medium';
    displayValue = `"${value}"`;
  } else if (typeof value === 'number') {
    valueColor = 'text-sky-600 dark:text-sky-400 font-mono font-semibold';
  } else if (typeof value === 'boolean') {
    valueColor = 'text-purple-600 dark:text-purple-400 font-semibold';
  } else if (value === null) {
    valueColor = 'text-rose-500 font-semibold';
    displayValue = 'null';
  }

  const rawTextValue = typeof value === 'string' ? value : String(value);

  return (
    <div className="py-0.5 flex items-baseline group" style={{ marginLeft: `${depth * 14 + 18}px` }}>
      {/* Clickable Key */}
      <span 
        onClick={(e) => handleCopy(String(label), false, e)}
        className="text-foreground/80 mr-1.5 font-bold shrink-0 cursor-pointer hover:text-primary relative flex items-center gap-1"
        title="Click to copy key name"
      >
        {label}:
        {copiedKey && <Check className="h-2.5 w-2.5 text-emerald-500 animate-in zoom-in-50 duration-150 absolute -top-2 -right-2" />}
      </span>

      {/* Copyable Value */}
      <span 
        onClick={(e) => handleCopy(rawTextValue, true, e)}
        className={`${valueColor} break-all cursor-pointer hover:bg-muted/30 px-1 relative transition-colors`}
        title="Click to copy raw value"
      >
        {displayValue}
        {copiedVal && <Check className="h-2.5 w-2.5 text-emerald-500 animate-in zoom-in-50 duration-150 absolute -top-2 -right-2 bg-background" />}
      </span>
    </div>
  );
}
