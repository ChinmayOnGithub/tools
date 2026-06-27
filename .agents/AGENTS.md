# AI Agent Code Quality Rules & Guidelines

This document defines the strict engineering, quality, and workflow rules that govern all development on the tools platform repository.

---

## 1. General Principles

*   **Simplicity**: Code must be readable, maintainable, modular, and reusable. Avoid premature optimization and complex abstractions.
*   **Decoupling**: Never mix business calculation logic with UI rendering. Separate pure calculations, components, layouts, configurations, types, hooks, and translation dictionaries.
*   **Dry (Don't Repeat Yourself)**: Reuse existing UI primitives (`src/components/ui/`) and common layouts. Extending code is preferred over duplicating functionality.

---

## 2. File & Component Rules

*   **File Scope**: One clear responsibility per file. Avoid duplicate configuration files. Keep files concise and split them only when it improves readability.
*   **React Server Components**: Make components Server Components by default. Convert to Client Components (`'use client'`) only when interactive state, local storage, or browser APIs are required.
*   **Hydration Guards**: Client Components that interact with browser-only APIs or local settings must defer rendering/execution until mounted (using state triggers) to prevent React hydration mismatches on static pre-renders.

---

## 3. TypeScript & Strict Standards

*   **Type Safety**: Enforce strict typing. Do not use `any` types. Avoid `unknown` unless required. Rely on compiler type-inferring when obvious.
*   **Absolute Imports**: Prefer absolute path resolutions (using `@/`) for all local imports to simplify file movements and refactoring.
*   **Unused Items**: Keep imports organized. Automatically remove unused imports, variables, local functions, and exports.
*   ** Centralized Logs**: Temporary console statements (`console.log`, `console.debug`) and unfinished `TODO` annotations are strictly forbidden in production commits.

---

## 4. Dependencies

*   **Audit First**: Before adding any npm packages, verify if the feature can be solved with existing standard browser APIs, native JS operations, or layout components.
*   **Minimization**: Reject dependency bloat to keep compilation builds lightweight and reduce supply-chain security risks.

---

## 5. Performance, SEO & Accessibility

*   **Render Optimization**: Avoid unnecessary state updates, cascading renders, and redundant `useEffect` listeners. Compute filters and projections dynamically during render cycles.
*   **SEO Metadata**: Every route page must dynamically export canonical URLs, page titles, sitemap priorities, and metadata descriptions. No manual metadata duplication is allowed.
*   **Accessibility Gates**: Every interactive trigger must support keyboard navigability (focus outlines, logical tab index ordering) and carry descriptive `aria-label` hooks. Semantically correct HTML5 tags are mandatory.

---

## 6. Verification Quality Gates

Before committing any changes, the codebase must pass:
1.  **Registry Validator**: `node scripts/validate-tools.js`
2.  **TypeScript Check**: `pnpm run typecheck`
3.  **ESLint Check**: `pnpm run lint`
4.  **Vitest Suite**: `pnpm run test`
5.  **Static Build**: `pnpm run build`
