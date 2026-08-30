import React from 'react';
import DocsSidebar from './DocsSidebar';
import DocsMobileNav from './DocsMobileNav';

interface DocsLayoutProps {
  children: React.ReactNode;
  toc?: React.ReactNode;
}

export default function DocsLayout({ children, toc }: DocsLayoutProps) {
  return (
    <div className="w-full">
      {/* Mobile Navigation Header */}
      <DocsMobileNav />

      {/* 3-Column Desktop Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Left Column: Fixed Navigation Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto pr-4">
              <DocsSidebar />
            </div>
          </aside>

          {/* Center Column: Focused Technical Reading Stream */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {children}
          </main>

          {/* Right Column: "On This Page" Table of Contents */}
          {toc && (
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto pl-2">
                {toc}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
