# Skill: SEO Review & Auditing

*   **Skill ID**: WS-SKILL-005
*   **Target Scope**: Pre-deployment audits of metadata, head tags, and structural layouts.
*   **Mandatory Rule Reference**: [seo-standards.md](../rules/seo-standards.md), [docs/requirements.md](../../docs/requirements.md)

---

## 1. Purpose

To define a repeatable workflow for auditing a tool's HTML output, meta headers, and layout parameters to guarantee optimal organic indexing.

---

## 2. Inputs

*   The source code of the tool being built.
*   The entry for the tool inside `src/config/tools-registry.ts`.

---

## 3. Workflow

1.  **Metadata Length Verification**:
    *   Measure the title length (must be between 30 and 60 characters).
    *   Measure the description length (must be between 100 and 160 characters).
2.  **Semantic Tags Audit**:
    *   Inspect the component's render method.
    *   Confirm that it contains no `<h1>` tags (the layout shell supplies the single `<h1>` on compilation).
    *   Verify that internal sub-headings use sequential header levels (`<h2>` down to `<h6>`).
3.  **Asset Sizing & Accessibility**:
    *   Confirm that all interactive buttons and inputs have descriptive text or `aria-label` tags.
    *   Verify that any images include descriptive `alt` tags.
4.  **Sitemap & Canonical Verification**:
    *   Confirm that the tool's slug has been added to the registry configuration.
    *   Verify that dynamic generation includes the tool in `sitemap.xml`.

---

## 4. Expected Output

*   An SEO evaluation report summarizing title, description, headers, and accessibility states.
*   Confirmation of sitemap entry registration.

---

## 5. Completion Checklist

- [ ] Has metadata length compliance been verified?
- [ ] Has the absence of redundant `<h1>` tags in the tool component been confirmed?
- [ ] Do all interactive controls contain `aria-label` attributes?
- [ ] Is the tool slug indexed by the sitemap script?
