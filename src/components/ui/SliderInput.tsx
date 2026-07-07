'use client';

interface SliderInputProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  /** Optional suffix appended to the value display, e.g. " px", " chars" */
  unit?: string;
  /** Optional custom value formatter — overrides default value+unit display */
  formatValue?: (val: number) => string;
  className?: string;
}

export function SliderInput({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = '',
  formatValue,
  className = '',
}: SliderInputProps) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label row */}
      <div className="flex items-center justify-between gap-2 select-none">
        <label
          htmlFor={id}
          className="text-[10px] font-black uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        <span className="font-mono text-[10px] font-extrabold text-foreground bg-muted/50 border border-border px-1.5 py-0.5 leading-tight tabular-nums">
          {displayValue}
        </span>
      </div>

      {/* Slider track wrapper */}
      <div className="relative flex items-center h-5">
        {/* Track background */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-border rounded-none" />
        {/* Track fill */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-primary rounded-none transition-[width] duration-100"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
        {/* Native input — transparent so styled track shows through */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          aria-label={label}
          className="relative w-full h-5 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:rounded-none
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-primary-foreground/30
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-webkit-slider-thumb]:active:scale-110
            [&::-moz-range-thumb]:h-3.5
            [&::-moz-range-thumb]:w-3.5
            [&::-moz-range-thumb]:rounded-none
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-primary-foreground/30
            [&::-moz-range-thumb]:shadow-md
            focus:outline-none
            focus-visible:[&::-webkit-slider-thumb]:ring-2
            focus-visible:[&::-webkit-slider-thumb]:ring-ring
            focus-visible:[&::-webkit-slider-thumb]:ring-offset-1"
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between text-[9px] font-bold text-muted-foreground/60 select-none tabular-nums">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
