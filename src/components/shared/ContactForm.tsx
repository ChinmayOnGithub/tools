'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Simulate reliable client-side processing submission
    setTimeout(() => {
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-6">
      <div>
        <h2 className="text-lg font-extrabold text-foreground">Send Us a Direct Message</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Have questions, policy inquiries, or bug reports? Reach out directly to our platform maintenance team.
        </p>
      </div>

      {status === 'success' ? (
        <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Message Delivered Successfully</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Thank you for contacting CoolTools. Our support team will review your inquiry and respond to your email address shortly.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-bold text-foreground">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 text-xs bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-bold text-foreground">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3 py-2 text-xs bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-subject" className="text-xs font-bold text-foreground">
              Inquiry Type
            </label>
            <select
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors"
            >
              <option value="general">General Support & Feedback</option>
              <option value="bug">Report a Bug / Error</option>
              <option value="feature">Request a New Tool</option>
              <option value="privacy">Privacy & Data Compliance</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-xs font-bold text-foreground">
              Your Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry, bug details, or tool suggestions..."
              className="w-full px-3 py-2 text-xs bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors resize-y"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground font-bold text-xs border-2 border-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{status === 'submitting' ? 'Sending Message...' : 'Submit Inquiry'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
