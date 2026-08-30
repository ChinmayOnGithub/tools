'use client';

interface PrivacyBadgeProps {
  className?: string;
  badgeClassName?: string;
  type?: 'local' | 'api';
}

export function PrivacyBadge({ 
  className = '', 
  badgeClassName = 'border-primary/20 bg-primary/5 text-primary',
  type = 'local'
}: PrivacyBadgeProps) {
  const localBadges = ['In-Browser Compute', 'No File Uploads', 'Free Forever'];
  const apiBadges = ['Live Public API', 'Direct Provider Request', 'No Tool Server Retention'];

  const badges = type === 'api' ? apiBadges : localBadges;

  return (
    <div className={`flex flex-wrap gap-2 select-none ${className}`}>
      {badges.map((text) => (
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
