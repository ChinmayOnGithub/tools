# Tool Development Framework Specification

*   **Document Path**: [docs/tool-framework.md](./tool-framework.md)
*   **Highest Authority Reference**: [docs/architecture.md](./architecture.md) (translates plugin architectures to implementation standards).
*   **Primary Reader**: Developer, AI Agent.

---

## 1. Directory Structure Standards

Every new tool added to the platform must reside inside its own isolated plugin folder under `src/components/tools/[tool-slug]/`. Custom directories outside this boundary are prohibited.

The folder structure is defined as follows:

```
src/components/tools/[tool-slug]/
├── locales/
│   └── en.json           # Localization dictionary (mandatory UI labels)
├── index.tsx             # Entry UI component (default export, hydration guard)
├── utils.ts              # (Optional) Pure calculation and processing functions
├── utils.test.ts         # (Optional) Vitest unit tests for calculations
├── hooks/                # (Optional) Tool-specific custom React hooks
│   └── use[ToolName].ts
├── components/           # (Optional) Subcomponents used only by this tool
│   └── SubComponent.tsx
└── assets/               # (Optional) Static icons, SVGs, or files for this tool
```

---

## 2. Tool Metadata Specification

Every tool registered in `src/config/tools-registry.ts` must declare the following fields:

*   `id`: Slug matching the folder name (lowercase, hyphenated).
*   `name`: Display title in the UI.
*   `description`: Short UI summary (max 120 chars).
*   `category`: References one of the 6 category IDs.
*   `tags`: Search aliases (minimum 3 tags).
*   `keywords`: SEO keywords.
*   `icon`: Links to a registered icon name in `src/components/shared/Icon.tsx`.
*   `seoTitle`: Custom browser tab title (under 60 chars).
*   `seoDescription`: Custom meta description (under 160 chars).
*   `relatedTools`: Array of tool IDs for recommendation.
*   `requirements`: `{ browser: boolean; server: boolean; }`
*   `addedAt`: Launch date (`YYYY-MM-DD`).

---

## 3. Tool Lifecycle States

A tool moves through these standardized states during development:

```
Draft ➜ Planned ➜ In Development ➜ Testing ➜ Ready ➜ Published ➜ Maintenance
```

1.  **Draft**: Scoped in dynamic checklists. Entry component returns skeleton placeholders.
2.  **Planned**: Metadata registered in `tools-registry.ts` (returns Fallback loader).
3.  **In Development**: UI and pure functions are drafted. Unit tests are written.
4.  **Testing**: Static linter checks and local Vitest executions pass.
5.  **Ready**: Pre-merge build gates succeed. Accessibility and dark mode checked.
6.  **Published**: PR is merged to `main` by the developer. Sitemap indexes the tool.
7.  **Maintenance**: Minor bugs resolved. Dependencies updated.

---

## 4. Definition of Done Checklist

A tool is considered complete and ready for publishing ONLY when it satisfies this checklist:

- [ ] Registered correctly inside `src/config/tools-registry.ts`.
- [ ] Mapped to its dynamic lazy-loader inside `TOOLS_COMPONENTS`.
- [ ] Resides strictly inside the folder `src/components/tools/[tool-slug]/`.
- [ ] Employs Client Hydration Guards on all local storage or window calls.
- [ ] Uses only shared UI primitives (`src/components/ui/`) and common layouts.
- [ ] Pure functions reside in `utils.ts` and are tested in `utils.test.ts`.
- [ ] Displays UI labels from `locales/en.json` translation files.
- [ ] Semantic HTML headings conform to layout hierarchy (no `<h1>` inside components).
- [ ] Interactive triggers have visible focus outlines and `aria-label` tags.
- [ ] Automated tests compile with `tsc --noEmit` and run with `vitest run`.
- [ ] ESLint check parses with zero errors or warnings.
- [ ] Next.js static build pre-renders `/tools/[tool-slug]` successfully.

---

## 5. AI Operating Workflow

As an AI agent building a new tool, you **MUST** follow these steps. Never bypass validation:

### Step 1: Planning & Scope
1.  Read [docs/architecture.md](./architecture.md) and [docs/tool-framework.md](./tool-framework.md).
2.  Analyze registries to verify the category name and slug uniqueness.
3.  Create an `implementation_plan.md` detailing change files and verification steps. Await developer approval.

### Step 2: Boilerplate Scaffolding
1.  Create `locales/en.json` containing UI text labels.
2.  Create `utils.ts` and write pure functions.
3.  Create `utils.test.ts` and write test blocks for these functions.
4.  Create `index.tsx` containing the Client Hydration Guard wrapper and import labels.

### Step 3: Registration
1.  Add metadata to `TOOLS_REGISTRY` inside `src/config/tools-registry.ts`.
2.  Add dynamic import loader to `TOOLS_COMPONENTS` inside `src/config/tools-registry.ts`.

### Step 4: Verification
1.  Run the validation script: `node scripts/validate-tools.js`.
2.  Run tests: `pnpm test`.
3.  Run typecheck: `pnpm run typecheck`.
4.  Run lint: `pnpm run lint`.
5.  Run build: `pnpm run build`.
6.  Resolve every issue before declaring the task complete.
