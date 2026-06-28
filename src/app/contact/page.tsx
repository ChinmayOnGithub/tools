import { Metadata } from 'next';
import { Mail, AlertCircle, Sparkles } from 'lucide-react';

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const metadata: Metadata = {
  title: 'Contact Support & Feedback - CoolTools',
  description: 'Get in touch with the CoolTools team. Learn how to report bugs, submit feature requests, or browse our open-source codebase on GitHub.',
  alternates: {
    canonical: 'https://tools.chinmaypatil.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4">
      {/* Header section */}
      <section className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Contact Us
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Have a question, encountered a bug, or want to suggest a new browser utility? 
          Since all operations run client-side, we maintain direct open-source feedback channels.
        </p>
      </section>

      {/* Support Methods Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issue Tracker Box */}
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-3">
          <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Bug Reports & Feedback</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Spotted a bug or have a feature idea? Please open a ticket on our GitHub Issue tracker to help us improve.
          </p>
          <a 
            href="https://github.com" 
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-primary hover:underline block pt-1"
          >
            Open GitHub Issue
          </a>
        </div>

        {/* GitHub Box */}
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-3">
          <div className="h-10 w-10 bg-foreground/10 text-foreground flex items-center justify-center">
            <Github className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Open Source Repository</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            CoolTools is built on open standards and transparency. Browse the code repository, review code, or star the project.
          </p>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs font-bold text-primary hover:underline block pt-1"
          >
            Visit GitHub Repository
          </a>
        </div>
      </section>

      {/* Guidance Area */}
      <section className="bg-muted/30 border border-border p-6 space-y-6">
        <h2 className="text-lg font-bold text-foreground">Issue & Feedback Guidelines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>Report a Bug</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Encountered a validation error or processing crash? Open a GitHub issue detailing the tool name, your browser info, the inputs used, and steps to reproduce.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Request a Feature</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Need a specific utility or custom parameter option? Submit an issue tagged as a feature request on GitHub, explaining the target use case.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
