interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ label, value, icon, trend, className = '' }: StatsCardProps) {
  return (
    <div className={`bg-card border border-border p-4 card-depth-1 hover:card-depth-2 transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
