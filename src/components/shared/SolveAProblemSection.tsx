import Link from 'next/link';
import { 
  FileCode2, 
  KeyRound, 
  EyeOff, 
  Clock, 
  FileStack, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

const PROBLEMS = [
  {
    icon: FileCode2,
    problem: 'My JSON is throwing syntax parse errors',
    solution: 'Identify unquoted keys, single quotes, and trailing commas instantly.',
    toolId: 'json-validator',
    guideSlug: 'why-json-parse-fails-syntax-errors',
    badge: 'JSON & APIs',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: KeyRound,
    problem: 'My JWT token is expired or unauthorized',
    solution: 'Inspect exp/iat timestamps, payload claims, and Base64URL encoding.',
    toolId: 'jwt-decoder',
    guideSlug: 'how-to-debug-expired-jwt',
    badge: 'Authentication',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: EyeOff,
    problem: 'I found invisible characters breaking string comparisons',
    solution: 'Detect hidden zero-width spaces, BOM markers, and homoglyphs.',
    toolId: 'unicode-inspector',
    guideSlug: 'how-to-find-invisible-unicode-characters',
    badge: 'Unicode & Text',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Clock,
    problem: 'My API timestamp is 1000× too large or year 1970',
    solution: 'Convert between 10-digit seconds and 13-digit milliseconds epochs.',
    toolId: 'timestamp-explorer',
    guideSlug: 'unix-timestamp-seconds-vs-milliseconds',
    badge: 'Time & Dates',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: FileStack,
    problem: 'My PDF document is too large for upload limits',
    solution: 'Compress images, merge multi-page documents, and extract pages locally.',
    toolId: 'pdf-compress',
    guideSlug: 'how-to-reduce-pdf-file-size',
    badge: 'PDF Documents',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
];

export default function SolveAProblemSection() {
  return (
    <section className="bg-card border-2 border-border p-6 sm:p-8 card-depth-2 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            <span>Problem-Solving Knowledge Base</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            Solve a Specific Developer Problem
          </h2>
        </div>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline self-start sm:self-auto"
        >
          <span>Explore Developer Guides</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROBLEMS.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="bg-muted/20 border-2 border-border p-4 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all card-depth-1 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`h-8 w-8 ${item.bg} ${item.color} flex items-center justify-center`}>
                    <IconComp className="h-4 w-4" />
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-background px-2 py-0.5 border border-border text-muted-foreground">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-black text-foreground group-hover:text-primary transition-colors">
                    {item.problem}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2 text-[11px]">
                <Link
                  href={`/guides/${item.guideSlug}`}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href={`/tools/${item.toolId}`}
                  className="font-semibold text-muted-foreground hover:text-foreground bg-background px-2 py-0.5 border border-border"
                >
                  Open Tool
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
