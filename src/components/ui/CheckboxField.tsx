'use client';

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  description,
  disabled = false,
  className = '',
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={`group flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      {/* Custom checkbox */}
      <div className="relative flex items-center justify-center shrink-0 mt-px">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
          aria-label={label}
        />
        {/* Outer box */}
        <div
          className="h-4 w-4 border-2 border-border bg-background transition-all duration-150
            peer-checked:bg-primary peer-checked:border-primary
            peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1
            group-hover:border-primary/70"
          aria-hidden="true"
        >
          {/* Checkmark */}
          {checked && (
            <svg
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full p-0.5"
              aria-hidden="true"
            >
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="square"
                strokeLinejoin="miter"
                className="text-primary-foreground"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Label & optional description */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
          {label}
        </span>
        {description && (
          <span className="text-[10px] text-muted-foreground font-medium leading-tight">
            {description}
          </span>
        )}
      </div>
    </label>
  );
}
