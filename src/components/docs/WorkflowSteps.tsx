import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { TOOLS_REGISTRY } from '@/config/tools-registry';

interface StepItem {
  stepNumber: number;
  title: string;
  description: string;
  toolId?: string;
  tips?: string;
}

interface WorkflowStepsProps {
  title?: string;
  steps: StepItem[];
  className?: string;
}

export default function WorkflowSteps({
  title = 'Workflow Execution Steps',
  steps,
  className = '',
}: WorkflowStepsProps) {
  return (
    <div className={`space-y-4 my-4 ${className}`}>
      {title && (
        <h3 className="text-xs font-black uppercase tracking-wider text-primary">
          {title}
        </h3>
      )}

      <div className="space-y-3">
        {steps.map((step) => {
          const tool = step.toolId ? TOOLS_REGISTRY.find((t) => t.id === step.toolId) : null;

          return (
            <div
              key={step.stepNumber}
              className="p-3.5 bg-card border border-border flex flex-col gap-2 transition-all hover:border-primary/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-5 bg-primary text-primary-foreground font-black text-[10px] flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                  <h4 className="text-xs font-black text-foreground">{step.title}</h4>
                </div>

                {tool && (
                  <Link
                    href={`/tools/${tool.id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline self-start sm:self-auto bg-primary/5 px-2 py-0.5 border border-primary/20"
                  >
                    <span>Launch {tool.name}</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed pl-7">
                {step.description}
              </p>

              {step.tips && (
                <div className="ml-7 p-2 bg-muted/20 border border-border/80 flex items-start gap-1.5 text-[10px]">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Tip:</strong> {step.tips}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
