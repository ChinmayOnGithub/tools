# Technical Stack & Directory Layout

*   **Document Path**: [docs/tech-stack.md](./tech-stack.md)
*   **Highest Authority Reference**: [docs/architecture.md](./architecture.md) (governs technical implementation choices).
*   **Primary Reader**: Developer, AI Assistant.

---

## 1. Technologies & Packages

The project uses the following specific software versions and libraries. No additional packages may be added without approval:

*   **Framework**: Next.js (latest stable App Router using React Server Components for shell, Client Components for tools).
*   **Language**: TypeScript (strict mode enabled).
*   **Styles**: Tailwind CSS (Utility-first styling, standard custom config).
*   **UI Primitives**: shadcn/ui (radix-ui wrapper base).
*   **Icons**: Lucide Icons (`lucide-react`).
*   **Package Manager**: pnpm.
*   **Linter**: ESLint (recommended next-linter defaults).
*   **Formatter**: Prettier.
*   **Testing**: Vitest (for core calculations and helper logic).
*   **Hosting Platform**: Vercel (Static Site Generation output).
*   **Monetization**: Google AdSense.
*   **Analytics**: Google Analytics 4 (GA4) & Google Search Console.

---

## 2. Directory Layout & Key Files

This schema defines where source code and configuration files are located. Adherence to this layout is mandatory:

```
tools/
├── docs/                     # Documentation files
├── .windsurf/                # AI Agent commands/rules
├── .gitignore                # Git ignore configuration
├── .github/
│   └── workflows/
│       └── ci.yml            # CI Quality Gates Workflow
├── package.json              # App package declarations & npm scripts
├── pnpm-lock.yaml            # pnpm dependency lock file
├── tsconfig.json             # TypeScript compiler settings
├── tailwind.config.ts        # Tailwind stylesheet declarations
├── postcss.config.js         # CSS compiler configurations
├── next.config.mjs           # Next.js bundler settings (output: 'export')
├── components.json           # shadcn/ui CLI configuration
├── vitest.config.ts          # Vitest configurations
├── src/
│   ├── app/                  # Next.js app pages & layouts
│   │   ├── layout.tsx        # Shell layout (Header, Footer, GA/Ad scripts)
│   │   ├── page.tsx          # Homepage showing all tool cards
│   │   ├── sitemap.ts        # Dynamic sitemap.xml generator
│   │   └── tools/
│   │       └── [slug]/
│   │           └── page.tsx  # Dynamic tool wrapper (SSG router)
│   ├── components/
│   │   ├── ui/               # shadcn primitive library (buttons, inputs)
│   │   ├── shared/           # Cross-tool layout components (AdContainer, Layouts, ErrorBoundary)
│   │   └── tools/            # Tool directory modules
│   ├── config/
│   │   └── tools-registry.ts # Central registry containing metadata for all tools
│   └── lib/                  # Shared utilities (analytics, helpers)
```

---

## 3. Configuration Templates

### 3.1 Next.js Build Target Configuration (`next.config.mjs`)
Because all tools execute client-side and require static optimization for performance and cost, Next.js must be configured for static export:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true, // Required for static export on Vercel
  },
  reactStrictMode: true,
  // Custom headers can be configured via hosting panel (Vercel)
};

export default nextConfig;
```

### 3.2 Content Security Policy (CSP) Header Config
Since we load Google Ads and Analytics, the Vercel hosting config (or header injection) must allow Google-origin assets while protecting customer environments:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://pagead2.googlesyndication.com;
frame-src 'self' https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;
connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net;
```

### 3.3 GitHub Actions Workflow (`.github/workflows/ci.yml`)
To enforce quality gates before branches are merged into `main`, GitHub Actions must run compilation and testing checks:
```yaml
name: CI Quality Gates

on:
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Install pnpm
      uses: pnpm/action-setup@v3
      with:
        version: 9

    - name: Install Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'pnpm'

    - name: Install Dependencies
      run: pnpm install --frozen-lockfile

    - name: Run Linter
      run: pnpm run lint

    - name: Type Check TypeScript
      run: pnpm run typecheck

    - name: Run Unit Tests (Vitest)
      run: pnpm test run
```

---

## 4. Linting, Formatting, and Compiler Policies

*   **TypeScript**: Must have `strict: true`, `noImplicitAny: true`, and `strictNullChecks: true` configured in `tsconfig.json`.
*   **Prettier**: Standard settings with semi-colons, single-quotes, and 2-space indentation.
*   **ESLint**: Default configurations plus `eslint-plugin-react-hooks` and import-sorting rules to keep imports structured.

---

## 5. Document Boundaries & Relationships

*   **Derived from**: [docs/architecture.md](./architecture.md) (translates abstract modular architecture to files).
*   **Informs**: `.windsurf/rules/coding-standards.md` (which maps compilation rules to code execution constraints).
*   **Excludes**: High-level system design patterns, product milestones, marketing strategies, or user flows.
