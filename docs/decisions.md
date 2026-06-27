# Architectural Decision Records (ADRs)

*   **Document Path**: [docs/decisions.md](./decisions.md)
*   **Highest Authority Reference**: [docs/architecture.md](./architecture.md) (ADRs document decisions made to implement architecture).
*   **Primary Reader**: Developer, AI Assistant.

---

## 1. ADR Index

1.  **[ADR-001: Core Technology Stack Selection](#adr-001-core-technology-stack-selection)** (Status: Accepted)
2.  **[ADR-002: Dynamic SSG Plugin Routing](#adr-002-dynamic-ssg-plugin-routing)** (Status: Accepted)
3.  **[ADR-003: Pure Client-Side Execution](#adr-003-pure-client-side-execution)** (Status: Accepted)
4.  **[ADR-004: Fixed-Ratio Ad Containers for Google AdSense](#adr-004-fixed-ratio-ad-containers-for-google-adsense)** (Status: Accepted)
5.  **[ADR-005: Domain Agnosticism Configuration](#adr-005-domain-agnosticism-configuration)** (Status: Accepted)
6.  **[ADR-006: Vitest for Calculations Unit Testing](#adr-006-vitest-for-calculations-unit-testing)** (Status: Accepted)
7.  **[ADR-007: JSON Translation Dictionaries for i18n](#adr-007-json-translation-dictionaries-for-i18n)** (Status: Accepted)
8.  **[ADR-008: Client Hydration Guards and React Error Boundaries](#adr-008-client-hydration-guards-and-react-error-boundaries)** (Status: Accepted)
9.  **[ADR-009: Pre-Merge Quality Gates via GitHub Actions](#adr-009-pre-merge-quality-gates-via-github-actions)** (Status: Accepted)

---

## ADR-001: Core Technology Stack Selection

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
We need to select a framework, styling library, and package manager for a platform containing hundreds of modular tools. The platform must load instantly, maintain strict SEO headers, and be easily maintainable by a single developer.

### Decision
We chose **Next.js (App Router)** with **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **pnpm**.
*   *Next.js* allows pre-rendering HTML statically while retaining dynamic client-side hydration.
*   *TypeScript* prevents compilation errors and interfaces well with AI.
*   *Tailwind CSS* keeps stylesheets bundled and optimizes out unused styles.
*   *shadcn/ui* delivers accessible (Radix-based) unstyled primitives that we copy into our codebase, preventing NPM bloating.
*   *pnpm* offers fast, cached, disk-space-efficient package installation.

### Consequences
*   **Pros**: Extreme load times, zero-runtime CSS bloat, clean type safety, modular structures.
*   **Cons**: Dynamic tool components must use lazy loading to avoid rendering overhead on the main bundle.

---

## ADR-002: Dynamic SSG Plugin Routing

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
Adding a new tool should require minimal manual code changes. If we create a new Next.js page directory for every single tool (e.g. `app/tools/json-formatter/page.tsx`, `app/tools/image-resizer/page.tsx`), it creates redundant page layout folders, duplication of sitemap configurations, and increases codebase noise.

### Decision
We chose a **dynamic catch-all route** (`app/tools/[slug]/page.tsx`) mapped to a **central JSON registry** (`src/config/tools-registry.ts`) using Next.js **`generateStaticParams()`**.
*   The router reads the parameter slug, finds the metadata in the registry, and dynamically imports the corresponding component via `next/dynamic`.
*   During static build, all registered slug routes are generated into static HTML files.

### Consequences
*   **Pros**: Adding a new tool only requires registering its config in `tools-registry.ts` and building its folder in `src/components/tools/`. Absolute plugin separation.
*   **Cons**: Metadata generation relies on reading the registry, meaning a registry syntax error can break all static routing builds.

---

## ADR-003: Pure Client-Side Execution

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
Processing PDF documents, heavy string parses, or image alterations on a remote server incurs server CPU/RAM costs, exposes user data, requires secure API development, and increases infrastructure complexity.

### Decision
We decided that **all tool computations must execute locally in the client browser**. Heavy computing uses Web Workers or WebAssembly. We will use browser native APIs (HTML Canvas, FileReader, Crypto Web API) or lightweight, tree-shakable client-side libraries.

### Consequences
*   **Pros**: Free hosting scalability (hosting static assets only), maximum privacy (user files never leave their machine), fast response times (no network roundtrips).
*   **Cons**: Browser memory and processing power limits what actions can be executed. High CPU operations can block the main UI thread if Web Workers are not configured correctly.

---

## ADR-004: Fixed-Ratio Ad Containers for Google AdSense

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
Google AdSense ads load asynchronously. When an ad script finishes loading, it updates the height of its layout container. This triggers Cumulative Layout Shift (CLS), which degrades User Experience and severely penalizes SEO search engine rankings.

### Decision
We decided to encapsulate all Google AdSense scripts inside a custom wrapper component (`AdContainer.tsx`) that enforces **fixed aspect-ratio dimensions and minimum heights** (`min-h-[250px]`, `min-w-[300px]`) via CSS, matching standardized Google Ad dimensions.
*   The container renders empty placeholders first.
*   When the ad script loads, the size remains unchanged, keeping CLS at `0.0`.

### Consequences
*   **Pros**: Guarantees Core Web Vitals score compliance (Lighthouse CLS = 0), securing SEO ranking.
*   **Cons**: Renders empty space while the ad script fetches and initiates, which can look awkward for the first 500ms of page load.

---

## ADR-005: Domain Agnosticism Configuration

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
Initially, the website will run on a subdomain `tools.chinmaypatil.com`. However, the architecture must support changing to a standalone primary domain (e.g. `cooltools.com`) later without requiring manual code changes or link edits.

### Decision
We chose to enforce **relative links for internal routing** and use a single public environment variable **`NEXT_PUBLIC_SITE_URL`** to generate absolute links for canonical URL tags, Google tag configurations, and the dynamic sitemap generation.

### Consequences
*   **Pros**: Absolute domain independence. Moving to a new domain is accomplished by changing a single Vercel dashboard environment variable and rebuilding.
*   **Cons**: Testing absolute paths (like XML sitemaps) locally requires configuring standard local environment overrides (`.env.development.local`).

---

## ADR-006: Vitest for Calculations Unit Testing

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
With a single developer managing hundreds of utility pages, a small fix in shared libraries or React packages risks silently breaking tool logic. We need automated verification without introducing the maintenance burden of heavy E2E tests (Playwright).

### Decision
We chose **Vitest** for unit testing functional calculations and parsing utilities. All tools must maintain test files (e.g., `utils.test.ts`) covering basic boundary inputs. We reject dynamic browser E2E tests for the MVP to prioritize coding speed.

### Consequences
*   **Pros**: Extremely fast unit test execution. Guarantees calculation logic sanity.
*   **Cons**: Does not test actual browser layout rendering or DOM event bindings directly.

---

## ADR-007: JSON Translation Dictionaries for i18n

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
Multi-language support (i18n) is necessary to unlock massive non-English traffic for utility tools. However, integrating dynamic middleware routers on a purely static export project adds massive configuration complexity.

### Decision
We decided to keep route paths in English for the MVP, but mandate that all UI text keys reside inside standard **JSON Translation Dictionaries** inside local folder locations `src/components/tools/[tool-slug]/locales/en.json`.
*   This isolates presentation strings from UI structures, enabling simple language-swapping paths in the future without code refactoring.

### Consequences
*   **Pros**: Separation of text concerns. Zero framework routing overhead.
*   **Cons**: Requires manual text compilation in JSON layouts.

---

## ADR-008: Client Hydration Guards and React Error Boundaries

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
Next.js pre-rendered HTML pages throw React hydration warnings if they read local client parameters (localStorage, dark theme configuration) on initial run. Additionally, a crash in client-side file parsing will crash the global routing shell.

### Decision
We chose to require two layout wrappers:
1.  **Client Hydration Guards**: Using local state mounting check hooks to render safe skeleton styles until client storage is hydrated.
2.  **React Error Boundaries**: Wrapping the route `app/tools/[slug]/page.tsx` in a crash recovery wrapper showing a clean "Reset Tool" button if client calculations crash.

### Consequences
*   **Pros**: No hydration warning crashes; isolated tool crash resilience.
*   **Cons**: Minor visual delay (skeleton render) while mounting states.

---

## ADR-009: Pre-Merge Quality Gates via GitHub Actions

*   **Status**: Accepted
*   **Date**: 2026-06-27

### Context & Problem
AI agents and developers can introduce code syntax or formatting mismatches that deploy directly to production, bypassing manual local test runs.

### Decision
We chose to enforce a mandatory **GitHub Actions workflow pipeline** (`ci.yml`) on every PR, executing linter checks, TypeScript compiler check passes (`tsc --noEmit`), and Vitest test suites. Merging to `main` is blocked unless checks succeed.

### Consequences
*   **Pros**: Automated gate checks protect production stability.
*   **Cons**: Minor wait time (~1-2 minutes) for runner checks on pushes.

---

## 2. Document Boundaries & Relationships

*   **Derived from**: [docs/architecture.md](./architecture.md).
*   **Guides**: Future developer implementation (ensures they do not bypass client-side rules or violate CLS policies).
*   **Excludes**: Step-by-step code files, Git logs, and release cycles.
