'use client';

interface ColorPickerFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function ColorPickerField({
  id,
  label,
  value,
  onChange,
  className = '',
}: ColorPickerFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none"
      >
        {label}
      </label>

      {/* Picker row */}
      <div className="flex items-center gap-2.5">
        {/* Color swatch + native picker */}
        <div className="relative shrink-0 group">
          {/* Swatch preview */}
          <div
            className="h-9 w-9 border-2 border-border transition-all duration-150
              group-hover:border-primary group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-1"
            style={{ backgroundColor: value }}
            aria-hidden="true"
          />
          {/* Invisible native color input covering the swatch */}
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label={label}
          />
        </div>

        {/* Editable hex text input */}
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value;
            // Accept #RGB, #RRGGBB formats
            if (/^#([0-9A-Fa-f]{0,6})$/.test(v)) {
              onChange(v.length === 7 ? v : value);
            }
          }}
          maxLength={7}
          spellCheck={false}
          className="font-mono text-xs font-extrabold text-foreground bg-muted/40 border-2 border-border
            h-9 w-24 px-2 focus:outline-none focus:border-primary focus:bg-background
            transition-colors duration-150 rounded-none uppercase"
          aria-label={`${label} hex code`}
        />
      </div>
    </div>
  );
}
