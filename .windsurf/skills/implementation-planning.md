# Skill: Implementation Planning & Tool Scaffolding

*   **Skill ID**: WS-SKILL-006
*   **Target Scope**: Creating and maintaining implementation plans; scaffolding new tools.
*   **Mandatory Rule Reference**: [coding-standards.md](../rules/coding-standards.md), [architecture-standards.md](../rules/architecture-standards.md), [docs/architecture.md](../../docs/architecture.md)

---

## 1. Purpose

To guide the AI agent through research and design preparation steps before writing code, and establish a standard file template structure for scaffolding new tool modules.

---

## 2. Inputs

*   A user request or scoping issue detailing a new tool to build.
*   The current state of the workspace repository.

---

## 3. Workflow

### Phase 1: Research & Planning
1.  **Research Codebase**:
    *   Inspect components, libraries, and routing directories to locate code relating to the request.
2.  **Define Proposed Changes**:
    *   Group proposed file modifications by component (e.g. registry, layout, tool module).
    *   State exactly which files are to be created (`[NEW]`), modified (`[MODIFY]`), or deleted (`[DELETE]`) using relative paths.
3.  **Draft Verification Plan**:
    *   List command lines of automated linting or compiler tests to run (`pnpm run lint`, `tsc --noEmit`, `pnpm test run`).
    *   List manual validation steps (aspect-ratio checks on ads, test data inputs, dark/light theme checks, hydration guard rendering checks).
4.  **Create Implementation Plan**:
    *   Write the plan to `C:\Users\Chinmay\.gemini\antigravity\brain\[conversation-id]/implementation_plan.md` and set `request_feedback: true` in the metadata block.
5.  **Await Approval**:
    *   Stop executing and await the developer's confirmation. Do not write code or run modifications until approval is received.

### Phase 2: Tool Scaffolding (Upon Approval)
When scaffolding a new tool (e.g., dynamic slug `[tool-slug]`), you must generate the following structural directory layout:

1.  **Translations Registry Entry (`locales/en.json`)**:
    *   Create `src/components/tools/[tool-slug]/locales/en.json` containing all UI label key-value pairs.
2.  **Pure Logic Helpers (`utils.ts`)**:
    *   Create `src/components/tools/[tool-slug]/utils.ts` and write pure functions for calculations, conversions, and algorithms.
3.  **Vitest Tests (`utils.test.ts`)**:
    *   Create `src/components/tools/[tool-slug]/utils.test.ts` and write unit tests for the functions in `utils.ts`.
4.  **Default Export UI (`index.tsx`)**:
    *   Create `src/components/tools/[tool-slug]/index.tsx`.
    *   Enforce Client Hydration Guards before accessing any browser features (localStorage/window):
        ```typescript
        import React, { useState, useEffect } from 'react';
        import t from './locales/en.json';
        import { runUtility } from './utils';

        export default function ToolComponent() {
          const [mounted, setMounted] = useState(false);
          useEffect(() => { setMounted(true); }, []);
          
          if (!mounted) {
            return <div className="animate-pulse bg-muted h-64 rounded-lg" />; // Safe Skeleton
          }

          return (
            <div className="p-6 bg-card text-card-foreground rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{t.title}</h2>
              {/* Tool layout elements here */}
            </div>
          );
        }
        ```
5.  **Registry Setup (`tools-registry.ts`)**:
    *   Append metadata configuration array inside `src/config/tools-registry.ts`.

---

## 4. Expected Output

*   An approved `implementation_plan.md` document detailing changes and verification checklists.
*   A clean, isolated tool module structure matching the scaffolding layout.

---

## 5. Completion Checklist

- [ ] Has the target workspace been scanned to locate relevant dependency files?
- [ ] Are proposed changes clearly grouped and labeled (`[NEW]`, `[MODIFY]`, `[DELETE]`)?
- [ ] Does the plan define automated and manual verification steps?
- [ ] Has the plan been submitted for review?
- [ ] (If Scaffolding) Are translation files, unit tests, hydration shields, and components generated under the isolated folder path?
