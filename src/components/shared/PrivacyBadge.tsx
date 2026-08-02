'use client';

interface PrivacyBadgeProps {
  className?: string;
  badgeClassName?: string;
}

export function PrivacyBadge({ 
  className, 
  badgeClassName = 'border-primary/20 bg-primary/5 text-primary' 
}: PrivacyBadgeProps) {
  return (
    <div className={`flex flex-wrap gap-2 select-none ${className}`}>
      {['Local Processing', 'Privacy Safe', 'No Uploads', '100% Free', 'Instant'].map((text) => (
        <span 
          key={text} 
          className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest border rounded-none ${badgeClassName}`}
        >
          {text}
        </span>
      ))}
    </div>
  );
}

export default PrivacyBadge;
