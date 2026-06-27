# Rule: Documentation Standards

*   **Rule ID**: WS-RULE-003
*   **Target Scope**: All markdown files in `/docs`, README.md, and code comments.
*   **Highest Authority**: [docs/architecture.md](../../docs/architecture.md)

---

## 1. Objective

To prevent documentation drift and ensure that the planning repository remains the single source of truth for both human developers and AI agents.

---

## 2. Mandatory Practices

### Doc-First Development Sequence
*   You must modify planning documentation and obtain design review approval **before** creating or modifying application code files.
*   If an implementation exposes a need to deviate from a design, the documentation must be updated and approved first.

### Markdown Schema & Links
*   Always use portable **relative path references** inside markdown files (e.g. `[architecture.md](./architecture.md)` or `[architecture.md](../docs/architecture.md)`).
*   **Machine-specific absolute path links (like `file:///...`) are strictly prohibited** to ensure that documentation renders properly across all developers' machines, IDE layouts, and CI systems.
*   Format lists, tables, and system boundaries clearly using GitHub Flavored Markdown (GFM).
*   Add a standard metadata header to every document under `/docs/`:
    ```markdown
    *   **Document Path**: [docs/filename.md](./filename.md)
    *   **Highest Authority Reference**: [docs/parent-filename.md](./parent-filename.md)
    *   **Primary Reader**: [Audience]
    ```

### Decision Logs (ADR)
*   Every architectural change, new library dependency, or shift in configuration must be recorded in `docs/decisions.md` as an ADR entry using the standard layout (Status, Context, Decision, Consequences).

---

## 3. Prohibited Practices

*   **NO Redundant Specs**: Never copy paragraphs or technical details between files. Reference the file that has direct responsibility.
*   **NO Code Placeholders**: Do not insert un-implemented component specs into `architecture.md`. If a component is planned but not created, list it in `roadmap.md` and `task.md`.
*   **NO Unlinked Files**: Every markdown file in `/docs/` must be linked inside the root `README.md` index.

---

## 4. Validation Checklist

- [ ] Was the documentation updated prior to code execution?
- [ ] Do all local markdown links resolve correctly using relative pathing rules? Are there zero absolute `file:///` links?
- [ ] Is there zero duplicated content between `/docs/` files?
- [ ] If a configuration or stack decision was modified, was it registered as an ADR inside `docs/decisions.md`?
