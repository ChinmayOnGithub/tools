# Rule: Architecture Standards

*   **Rule ID**: WS-RULE-002
*   **Target Scope**: Directory structures, router configurations, module exports.
*   **Highest Authority**: [docs/architecture.md](../../docs/architecture.md)

---

## 1. Objective

To preserve the modular "plugin" model of the tools platform. This ensures that the codebase can scale to hundreds of utilities without core registry bloat or deployment cost inflation.

---

## 2. Mandatory Practices

### Plugin Registry Compliance
*   Every new tool must be registered inside [src/config/tools-registry.ts](../../src/config/tools-registry.ts) by adding a new entry to the configuration array.
*   The entry must strictly comply with the schema:
    ```typescript
    interface ToolEntry {
      id: string; // Dynamic URL slug matching the folder name
      name: string; // Human display name
      description: string; // Concise SEO description
      category: 'pdf' | 'image' | 'developer' | 'text' | 'calculator' | 'converter';
      tags: string[]; // Aliases for search terms
    }
    ```

### Tool Folder Isolation & Translation Setup
*   All code unique to a tool must reside inside its designated plugin folder: `src/components/tools/[tool-slug]/`.
*   All user-facing strings must reside in translation files under `src/components/tools/[tool-slug]/locales/en.json`.
*   The entry component of the tool must be exported as the **default export** from `src/components/tools/[tool-slug]/index.tsx`.
*   All assets, subcomponents, and custom workers specific to a tool must remain inside that tool's directory.

### Hydration & Error Management
*   Any component reading client-side data (like cookies, themes, or local storage) must implement the Client Hydration Guard hook pattern.
*   All tools must support rendering recovery states when wrapped inside error boundaries.

### Processing Boundaries
*   All data parsing, compression, calculations, and conversions must occur inside the client's browser.
*   Use native client Web Workers (`new Worker(new URL('./worker.ts', import.meta.url))`) for computational tasks taking longer than 100ms.

---

## 3. Prohibited Practices

*   **NO Server-Side Compute**: Creating API routes (`app/api/`) or executing server actions for tools operations is strictly prohibited.
*   **NO Root Routing Edits**: Editing `app/tools/[slug]/page.tsx` for tool-specific logic is banned. The dynamic wrapper page must remain generic.
*   **NO Direct Shared Lib Mutation**: Do not add code to `src/lib/` or `src/components/shared/` while working on a single tool. Keep all changes local to your tool directory.
*   **NO Node Dependencies**: Do not install packages that rely on Node runtime modules (`fs`, `dns`, `net`, `child_process`).

---

## 4. Validation Checklist

- [ ] Is the tool registered correctly inside `src/config/tools-registry.ts`?
- [ ] Is the entry component exported as a `default` export in `index.tsx`?
- [ ] Are all UI text elements isolated inside locales JSON structures?
- [ ] Are all local storage access paths protected by Client Hydration Guards?
- [ ] Are all calculations executed client-side?
- [ ] Are there zero files added to root layouts or routers for this tool?
- [ ] Has it been confirmed that the static sitemap auto-indexes the new route slug?
