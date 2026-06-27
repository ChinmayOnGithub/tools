import Link from 'next/link';
import { Icon } from './Icon';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ToolEntry } from '@/config/tools-registry';

interface ToolCardProps {
  tool: ToolEntry;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isPublished = tool.status === 'published';

  const getStatusText = (status: ToolEntry['status']) => {
    switch (status) {
      case 'planned': return 'Coming Soon';
      case 'draft': return 'Planned';
      case 'in-development': return 'In Dev';
      case 'testing': return 'Testing';
      default: return '';
    }
  };

  return (
    <Card className={`transition-all duration-200 flex flex-col justify-between h-full group relative ${
      isPublished 
        ? 'hover:border-primary/50 hover:shadow-md bg-card' 
        : 'border-muted bg-muted/10 opacity-80'
    }`}>
      <CardHeader className="p-5 flex flex-row items-start gap-4 space-y-0 pb-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          isPublished 
            ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}>
          <Icon name={tool.icon} className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded capitalize font-semibold">
              {tool.category}
            </span>
            {isPublished ? (
              <>
                {tool.featured && <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Featured</Badge>}
                {tool.popular && <Badge variant="default" className="text-[9px] px-1.5 py-0 bg-emerald-500 text-white hover:bg-emerald-500">Popular</Badge>}
              </>
            ) : (
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-amber-600 border-amber-500/20 bg-amber-500/5 select-none font-semibold">
                {getStatusText(tool.status)}
              </Badge>
            )}
          </div>
          <CardTitle className={`text-base truncate transition-colors ${
            isPublished ? 'group-hover:text-primary' : 'text-muted-foreground'
          }`}>
            <Link href={`/tools/${tool.id}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {tool.name}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <CardDescription className="text-xs line-clamp-2 leading-relaxed">
          {tool.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default ToolCard;
