import { Metadata } from 'next';
import { Mail, AlertCircle, Sparkles } from 'lucide-react';
import AdContainer from '@/components/shared/AdContainer';
import ContactForm from '@/components/shared/ContactForm';

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
  description: 'Get in touch with the CoolTools team. Learn how to report bugs, submit feature requests, contact support, or browse our open-source codebase on GitHub.',
  alternates: {
    canonical: 'https://tools.chinmaypatil.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="w-full space-y-8 py-4">
      {/* Header section */}
      <section className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Contact Us & Support
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Have questions, policy inquiries, bug reports, or feature ideas? 
          Submit a message using the form below or reach out via email.
        </p>
      </section>

      {/* Interactive Contact Form */}
      <ContactForm />

      {/* Support Methods Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issue Tracker Box */}
        <div className="bg-card border-2 border-border p-6 card-depth-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">Bug Reports & Feedback</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Spotted a validation error or processing crash? Please open a ticket on our official GitHub Issue tracker to help us improve.
            </p>
          </div>
          <a 
            href="https://github.com/ChinmayOnGithub/tools/issues" 
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center bg-primary text-primary-foreground text-xs font-bold px-4 py-2 border-2 border-primary transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            Open GitHub Issue Tracker
          </a>
        </div>
 
        {/* GitHub Box */}
        <div className="bg-card border-2 border-border p-6 card-depth-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="h-10 w-10 bg-foreground/10 text-foreground flex items-center justify-center">
              <Github className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">Open Source Repository</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Browse the code, review code signatures, star the repository, or fork the codebase to suggest local utility improvements.
            </p>
          </div>
          <a 
            href="https://github.com/ChinmayOnGithub/tools" 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex h-9 items-center justify-center bg-transparent border-2 border-border hover:border-primary hover:bg-accent text-xs font-bold px-4 py-2 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            Visit GitHub Repository
          </a>
        </div>
      </section>

      {/* Guidance Area */}
      <section className="border-2 border-border p-6 space-y-4 bg-muted/10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Submission Guidelines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 border-l-2 border-primary/30 pl-4">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span>Report a Bug</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Open an issue detailing the specific tool name, your browser/OS version, the inputs used, and steps or sample files required to reproduce the error.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-primary/30 pl-4">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Request a Feature</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Submit an issue tagged as a feature request. Describe the missing browser utility or specify target parameters and local use cases.
            </p>
          </div>
        </div>
      </section>

      <AdContainer slot="bottom" />
    </div>
  );
}
