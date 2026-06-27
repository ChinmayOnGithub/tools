# Rule: SEO Standards

*   **Rule ID**: WS-RULE-005
*   **Target Scope**: Page components, metadata config, sitemap generation scripts.
*   **Highest Authority**: [docs/requirements.md](../../docs/requirements.md)

---

## 1. Objective

To ensure that every tool page on the platform is perfectly optimized for search crawler indexing, maximizing organic search ranking.

---

## 2. Mandatory Practices

### Page Metadata
*   Every tool entry must provide explicit SEO metadata inside `tools-registry.ts`.
*   Title tag format: `[Tool Name] - Free Online Browser Tool` (max 60 characters).
*   Meta Description must be dynamic, active, and clearly state that the tool operates locally: e.g., *"Free online JSON Formatter. Pretty-print, format, and validate your JSON code locally in your browser. No files uploaded."* (max 160 characters).

### HTML Structure
*   Every route page must have exactly **one** `<h1>` tag matching the tool's primary title.
*   Use semantic HTML5 elements: `<main>` for tool container, `<header>` for page shell, `<footer>` for footer, and `<aside>` for ad blocks.
*   Use standard `<section>` headings hierarchically (`<h2>`, `<h3>`).

### Canonicalization & Sitemaps
*   Set absolute canonical URLs on every page using the `NEXT_PUBLIC_SITE_URL` environment variable to prevent duplicate indexing issues.
*   Update `sitemap.ts` to ensure that any new tool slug registered in `tools-registry.ts` is automatically mapped.

---

## 3. Prohibited Practices

*   **NO Hardcoded Slugs**: Never hardcode tool titles or descriptions directly inside the dynamic page file `app/tools/[slug]/page.tsx`. Everything must be pulled from the registry.
*   **NO Blank Alt Attributes**: All images, icons, and SVG illustrations must have alternative text (`alt` or `aria-label`).
*   **NO Client-Side-Only Headers**: Never inject page metadata using client-side JavaScript headers (`helmet` or dynamic hooks). They must be rendered statically on the server-side via `generateMetadata()`.

---

## 4. Validation Checklist

- [ ] Does the page compile with a single `<h1>` tag containing the tool's name?
- [ ] Is the generated title under 60 characters and description under 160 characters?
- [ ] Does the page source show the canonical link matches the active site URL?
- [ ] Has the tool slug been validated as outputting to `sitemap.xml`?
