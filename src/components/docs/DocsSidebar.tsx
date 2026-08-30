'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPublishedNavigation } from '@/config/docs-registry';

interface DocsSidebarProps {
  className?: string;
}

export default function DocsSidebar({ className = '' }: DocsSidebarProps) {
  const pathname = usePathname();
  const navigation = getPublishedNavigation();

  return (
    <nav
      className={`space-y-6 text-xs ${className}`}
      aria-label="Documentation Sidebar"
    >
      <div className="pb-2 border-b border-border">
        <Link
          href="/guides"
          className="text-xs font-black uppercase tracking-widest text-primary hover:underline block"
        >
          Guides &amp; Solutions
        </Link>
      </div>

      <div className="space-y-6">
        {navigation.map((domain) => (
          <div key={domain.id} className="space-y-2">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              {domain.title}
            </h3>
            <ul className="space-y-1 pl-2 border-l border-border">
              {domain.items.map((item) => {
                const href = `/guides/${item.slug}`;
                const isActive = pathname === href;

                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      className={`block py-1 px-2 text-[11px] transition-colors rounded-none ${
                        isActive
                          ? 'font-bold text-primary bg-primary/10 border-l-2 -ml-[9px] border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium'
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
    </nav>
  );
}
