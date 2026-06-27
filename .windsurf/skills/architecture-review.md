# Skill: Architecture Review

*   **Skill ID**: WS-SKILL-002
*   **Target Scope**: Auditing directory boundaries, shared libraries, and dependencies.
*   **Mandatory Rule Reference**: [architecture-standards.md](../rules/architecture-standards.md), [docs/architecture.md](../../docs/architecture.md)

---

## 1. Purpose

To define a repeatable workflow for reviewing code changes to ensure they comply with system modularity, client-side computing rules, and dependency limits.

---

## 2. Inputs

*   A list of modified files or a proposed implementation plan.
*   A list of proposed new NPM package additions.

---

## 3. Workflow

1.  **Dependency Verification**:
    *   If a new package is proposed, inspect its source bundle.
    *   Verify that it contains zero imports of node system libraries (`fs`, `path`, `crypto`, etc.).
    *   Ensure the package supports ES modules (tree-shaking friendly).
2.  **Plugin Boundary Review**:
    *   Confirm that all new logic files reside strictly inside `src/components/tools/[tool-slug]/`.
    *   Verify that the main router `app/tools/[slug]/page.tsx` was not modified.
3.  **Client-Side Check**:
    *   Audit files to verify that no `fetch` or `axios` calls submit data payloads to remote servers.
    *   Verify that operations that process files or block the UI thread use Web Workers.
4.  **Shared Logic Review**:
    *   If changes are proposed to `src/lib/` or `src/components/shared/`, verify that the code affects multiple tools and cannot be written locally.

---

## 4. Expected Output

*   An architecture audit report confirming compliance or highlighting violations.
*   If violations exist, details of alternative approaches to resolve them.

---

## 5. Completion Checklist

- [ ] Have all proposed npm packages been verified as client-only?
- [ ] Are all new files located inside the tool's plugin directory?
- [ ] Have all server actions and API routes been verified as absent?
- [ ] Is heavy data calculation offloaded to a Web Worker?
