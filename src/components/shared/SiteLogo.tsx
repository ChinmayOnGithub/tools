import Link from 'next/link';

interface SiteLogoProps {
  /** Controls the visual size. Defaults to 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** When false, the logo is not wrapped in a link. Useful for auth / hero contexts. */
  linked?: boolean;
}

const sizeMap = {
  sm: {
    badge: 'px-2 py-0.5 text-xs',
    label: 'text-xs',
    wrapper: 'text-sm',
  },
  md: {
    badge: 'px-3 py-1 text-sm',
    label: 'text-sm',
    wrapper: 'text-base',
  },
  lg: {
    badge: 'px-4 py-1.5 text-base',
    label: 'text-base',
    wrapper: 'text-lg',
  },
};

/**
 * SiteLogo
 * Single source-of-truth logo component used everywhere:
 * Navigation header, footers, about page, etc.
 *
 * Design: wordmark-style pill badge + text label.
 * Hover transitions the badge from foreground → primary brand orange.
 */
export function SiteLogo({ size = 'md', linked = true }: SiteLogoProps) {
  const s = sizeMap[size];

  const mark = (
    <span
      className={`inline-flex items-center gap-2 font-extrabold tracking-tight group ${s.wrapper}`}
      aria-label="CoolTools"
    >
      <span
        className={`bg-foreground text-background font-extrabold tracking-tight group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 ${s.badge}`}
      >
        COOL
      </span>
      <span className={`font-extrabold tracking-tight ${s.label}`}>TOOLS</span>
    </span>
  );

  if (!linked) return mark;

  return (
    <Link href="/" aria-label="CoolTools — Home">
      {mark}
    </Link>
  );
}

export default SiteLogo;
