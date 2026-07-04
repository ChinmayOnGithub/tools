'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  titleClassName?: string;
}

export function FaqSection({ faqs, titleClassName = 'text-sm font-bold text-foreground' }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4">
      <h2 className={titleClassName}>Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border-2 transition-colors duration-200 bg-muted/10 ${
                isOpen ? 'border-primary' : 'border-border'
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-foreground text-xs select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`} 
                />
              </button>
              <div 
                className={`grid transition-all duration-200 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] border-t-2 border-border' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="p-4 text-xs text-muted-foreground leading-relaxed bg-background/50">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FaqSection;
