import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-2",
          // Variants
          variant === 'default' && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:scale-105 active:scale-95",
          variant === 'destructive' && "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90",
          variant === 'outline' && "border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary",
          variant === 'secondary' && "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80",
          variant === 'ghost' && "border-transparent hover:bg-accent hover:text-accent-foreground",
          variant === 'link' && "text-primary underline-offset-4 hover:underline border-transparent",
          // Sizes
          size === 'default' && "h-10 px-5 py-2",
          size === 'sm' && "h-8 px-3 text-xs",
          size === 'lg' && "h-12 px-8 text-base",
          size === 'icon' && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
