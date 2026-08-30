'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, BookOpen } from 'lucide-react';
import { GUIDE_DOMAINS } from '@/config/docs-registry';

export default function DocsMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Find currently active guide title if available
  let activeTitle = 'Documentation Menu';
  for (const domain of GUIDE_DOMAINS) {
    const match = domain.items.find((i) => `/guides/${i.slug}` === pathname);
    if (match) {
      activeTitle = `${domain.title}: ${match.title}`;
      break;
    }
  }

  return (
    <div className="lg:hidden w-full border-b border-border bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-foreground text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <BookOpen className="h-4 w-4 text-primary shrink-0" />
          <span className="truncate">{activeTitle}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-t border-border bg-background space-y-5 max-h-[60vh] overflow-y-auto">
          {GUIDE_DOMAINS.map((domain) => (
            <div key={domain.id} className="space-y-1.5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                {domain.title}
              </h4>
              <ul className="space-y-1 pl-2 border-l border-border">
                {domain.items.map((item) => {
                  const href = `/guides/${item.slug}`;
                  const isActive = pathname === href;

                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={`block py-1 px-2 text-xs ${
                          isActive
                            ? 'font-bold text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
