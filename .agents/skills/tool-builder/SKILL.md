---
name: tool-builder
description: Guide the creation, configuration, and verification of new browser utility tools following the platform framework.
---

# Tool Builder Workflow Skill

This skill ensures that every new browser utility added to the platform is structured, registered, and validated uniformly without deviations from architectural standards.

## Operation Sequence

### 1. Scoping & Planning
*   Query `src/config/categories.ts` to select the target category.
*   Define a unique, lowercase, hyphenated slug name for the new utility.
*   Declare the metadata parameters (tags, keywords, and description) to prevent keyword collisions.

### 2. Scaffold Folder Layout
Create a dedicated folder `src/components/tools/[tool-slug]/` and populate:
1.  **`locales/en.json`**: Translation dictionary containing UI labels.
2.  **`utils.ts`**: Pure functions for calculations (free from React states or browser objects).
3.  **`utils.test.ts`**: Vitest unit assertions testing calculations in isolation.
4.  **`index.tsx`**: Entry UI layout. Ensure the UI wraps its states in client-side mount checks (hydration guards).

### 3. Registry & Container Wiring
1.  Append metadata properties to `TOOLS_REGISTRY` inside `src/config/tools-registry.ts`. Set the status parameter to `'published'`.
2.  Append lazy-loader dynamic import mapping to `TOOLS_COMPONENTS` inside `src/components/shared/ToolContainer.tsx`.

### 4. Quality Audit Run
Run the quality gate commands in sequence:
*   Static registry and path validation: `node scripts/validate-tools.js`
*   TypeScript compiler validation: `pnpm run typecheck`
*   ESLint syntax validation: `pnpm run lint`
*   Vitest suite check: `pnpm run test`
*   Next.js production compile build verification: `pnpm run build`
*   Verify sitemaps, robots.txt, and metadata tags render correctly.
