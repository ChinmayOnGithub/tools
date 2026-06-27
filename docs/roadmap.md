# Platform Development Roadmap

*   **Document Path**: [docs/roadmap.md](./roadmap.md)
*   **Highest Authority Reference**: [docs/vision.md](./vision.md) (governs roadmap priorities).
*   **Primary Reader**: Developer, AI Assistant.

---

## 1. Roadmap Philosophy

This roadmap outlines the milestones required to build and scale the online tools platform. 
*   **NO dates** are assigned.
*   **NO time estimates** are provided.
*   **NO story points** are tracked.
*   **NO developers** are assigned tasks.
*   Progression is strictly sequence-based. A milestone is complete when all its criteria are verified.

---

## 2. Milestones Sequence

### Milestone 1: Platform Setup & Scaffolding
*   **Objective**: Initialize the repository and configure building pipelines.
*   **Scope**:
    *   Initialize package repository using Next.js App Router, TypeScript, and pnpm.
    *   Setup code styling, ESLint, Prettier, and path aliases.
    *   Configure Vitest testing environment and create base tests.
    *   Configure GitHub Actions workflows (`ci.yml`) to enforce code formatting and type checks.
    *   Configure Vercel deployment project with static output (`output: 'export'`).
    *   Implement basic root layouts (Header, Footer, CSS variables).

### Milestone 2: Core Routing & Plug-in Registry
*   **Objective**: Build the dynamic routing layout that enables the plugin model.
*   **Scope**:
    *   Create `src/config/tools-registry.ts` and define tool schema.
    *   Create dynamic router `app/tools/[slug]/page.tsx` with dynamic metadata, hydration guards, React error boundaries, and SSG config.
    *   Implement static asset/sitemap generator (`sitemap.ts`).
    *   Integrate shadcn/ui framework and layout primitives.

### Milestone 3: Initial Utility Batch (MVP Release)
*   **Objective**: Deploy the first functional suite of browser-processed utilities.
*   **Scope**:
    *   **Developer Tool**: JSON Formatter & Validator (pretty-print, minify, validate, copy). Include Vitest test suite.
    *   **Text Tool**: Case Converter & Word Counter (word/char count, UPPER, lower, Sentence case). Include Vitest test suite.
    *   **Calculator**: Date & Time Calculator (duration between dates, add/subtract days). Include Vitest test suite.
    *   Verify absolute client-side execution (zero network requests during tool run).

### Milestone 4: Monetization & Analytics Integration
*   **Objective**: Configure user tracking, SEO indexing, and Google AdSense layouts.
*   **Scope**:
    *   Configure Google Analytics 4 (GA4) script integration with custom route-change events.
    *   Add Google Search Console verification headers.
    *   Develop the `<AdContainer />` component with fixed height boundaries and asynchronous script loading strategies to prevent interaction delays.
    *   Deploy GDPR-compliant cookie consent banner.

### Milestone 5: Expansion Pack A (Image & PDF Tools)
*   **Objective**: Build resource-heavy client-side image and document processing tools.
*   **Scope**:
    *   **Image Tool**: Client-side Image Compressor and Format Converter (PNG to WebP, JPEG to PNG) using HTML Canvas API.
    *   **PDF Tool**: Client-side PDF Merger and Splitter using a lightweight JS library (e.g. `pdf-lib` loaded dynamically).
    *   Verify Web Worker implementation for tasks running >100ms.

### Milestone 6: Custom Domain Migration
*   **Objective**: Migrate the hosting setup from sub-domain to the primary production domain.
*   **Scope**:
    *   Provision and link the new custom domain inside Vercel Dashboard.
    *   Update `NEXT_PUBLIC_SITE_URL` in environment configurations.
    *   Validate canonical URLs, sitemaps, and robots.txt files.
    *   Initiate Google Search Console address change utility.

---

## 3. Document Boundaries & Relationships

*   **Informed by**: [docs/vision.md](./vision.md) and [docs/requirements.md](./requirements.md).
*   **Controls**: [docs/decisions.md](./decisions.md) (which documents decisions made per milestone).
*   **Excludes**: Technical code configurations, UI design mockups, and deployment credentials.
