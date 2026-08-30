

interface TrustBannerProps {
  items?: string[];
  className?: string;
}

export function TrustBanner({ 
  items = [
    'Client-Side In-Browser Execution',
    'Zero Server-Side Tool Processing',
    'No Account or Registration Required'
  ],
  className = ''
}: TrustBannerProps) {
  return (
    <div className={`bg-muted/30 border-2 border-border p-3 rounded-none text-[10px] sm:text-xs font-bold text-muted-foreground flex flex-wrap gap-x-4 gap-y-1.5 ${className}`}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          {item}
        </span>
      ))}
    </div>
  );
}

export default TrustBanner;
