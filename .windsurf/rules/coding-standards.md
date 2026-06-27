# Rule: Coding Standards

*   **Rule ID**: WS-RULE-001
*   **Target Scope**: All TypeScript, React, and CSS/Tailwind files.
*   **Highest Authority**: [docs/tech-stack.md](../../docs/tech-stack.md)

---

## 1. Objective

To maintain a clean, readable, self-documenting, and type-safe codebase. This guarantees that code is easy to refactor by a single developer and easy to analyze by AI agents.

---

## 2. Mandatory Practices

### TypeScript Strictness
*   Use TypeScript `strict` mode. Explicitly define all parameter and function return types.
*   Use `interface` for component prop types and data models. Use `type` only for unions, intersections, or primitives.
*   Exhaustive type checking: use TypeScript's compiler to verify that switch-case statements are exhaustive using a `never` assignment pattern.

### React Component Design
*   Use functional components with arrow syntax.
*   Use React hooks (useState, useEffect, useMemo, useCallback) appropriately. Keep useEffect footprint minimal.
*   Destructure props directly in the component argument list.

### Styling & Tailwind CSS
*   Write layouts using mobile-first Tailwind utility classes.
*   Order Tailwind classes logically: Layout (flex, grid) -> Sizing (w, h) -> Box Model (p, m, border) -> Typography -> Colors.
*   Use the `cn` utility library (powered by `clsx` and `tailwind-merge`) for dynamic conditional class strings.

### Imports
*   Use absolute paths with alias prefix `@/` (e.g. `import { Button } from '@/components/ui/button'`).
*   Order imports systematically: (1) React/Next libraries, (2) Third-party NPM packages, (3) Global/Shared modules (`@/components/*`, `@/lib/*`), (4) Relative local components/utils.

### Testing (Vitest)
*   Every utility file containing core processing logic (e.g., `utils.ts` in tool directories) must be paired with an adjacent unit test file `utils.test.ts`.
*   Maintain unit test coverage for boundary parameters (e.g. null inputs, empty inputs, extremely large inputs).

---

## 3. Prohibited Practices

*   **NO `any` types**: Using `any` is strictly prohibited. If a type is unknown, use `unknown` and perform type-guard verification.
*   **NO Inline styles**: CSS styles must be written via Tailwind classes. Do not use `style={{ ... }}` unless calculation parameters are dynamic (e.g. canvas rendering bounds or dragging coordinates).
*   **NO CSS Modules**: Custom `.module.css` files are banned. Use Tailwind config extension for custom layouts.
*   **NO Global State imports**: Direct integration of global state managers (Zustand/Redux) inside tool directories is banned.

---

## 4. Validation Checklist

- [ ] Does the file build with `tsc --noEmit` without errors?
- [ ] Are all types explicitly declared? No implicit `any`?
- [ ] Are Tailwind classes ordered logically and combined using the `cn()` utility where dynamic?
- [ ] Are imports sorted correctly and using absolute `@/` path aliases?
- [ ] Are all calculation utilities paired with an adjacent Vitest `.test.ts` file?
- [ ] Are there zero console errors or hydration mismatches in local runs?
