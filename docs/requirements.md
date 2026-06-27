# Product Requirements Specification

*   **Document Path**: [docs/requirements.md](./requirements.md)
*   **Highest Authority Reference**: [docs/vision.md](./vision.md) (governs requirements intent).
*   **Primary Reader**: Developer, AI Agent.

---

## 1. System Overview & Scope

The platform is a static-first Next.js web application. It acts as an orchestrator hosting a directory of modular, plug-in tools. The requirements ensure that the system remains extremely fast, search-engine indexable, and respects user privacy.

---

## 2. Functional Requirements

### 2.1 Tool Lifecycle & Registry
*   **Plug-in Model**: Adding a new tool must only require adding a component folder and declaring the tool details in a local registry file.
*   **Self-Containment**: A tool must contain all its specific logic, calculations, and local state. It must not depend on global application state.
*   **Search & Discovery**: The homepage must provide instant client-side search across all tools, indexing by tool name, category, and alias tags.

### 2.2 Category Organization
The platform must support organizing tools into the following categories from day one:
1.  **PDF Tools**: Merge, Split, Compress, Convert, Rotate.
2.  **Image Tools**: Compress, Resize, Crop, Convert format, Color Picker.
3.  **Developer Tools**: JSON Formatter, Base64 Encoder/Decoder, JWT Debugger, Diff Checker, Markdown Previewer.
4.  **Text Tools**: Word Counter, Case Converter, Regex Tester, Lorem Ipsum Generator.
5.  **Calculators**: Financial, Scientific, Date Calculator, Percentage Calculator.
6.  **Converters**: Unit Converter, Currency Converter, Timestamp Converter.

### 2.3 User Interface & Ads
*   **Theme Toggle**: Support Dark and Light mode seamlessly, persisting user preference.
*   **Ad Placements**: Reserve designated, layout-stable zones for Google AdSense slots (top header, side rails, and bottom inline) to prevent layout shifts.

---

## 3. Non-Functional Requirements

### 3.1 Performance & Core Web Vitals
To rank high on Google Search and maintain high organic traffic, the platform must hit the following performance targets globally:
*   **Largest Contentful Paint (LCP)**: < 1.2 seconds.
*   **Interaction to Next Paint (INP)**: < 100 milliseconds.
*   **Cumulative Layout Shift (CLS)**: Exactly 0.0 (Ad placements must use fixed aspect-ratio placeholders).
*   **Lighthouse Performance Score**: > 95/100 on both mobile and desktop.

### 3.2 SEO-First Specifications
*   **Static Rendering**: Homepage and all tool landing pages must be pre-rendered to HTML at build time (Static Site Generation - SSG).
*   **Dynamic Metadata**: Every tool page must have unique Title, Meta Description, Open Graph tags, and Canonical URLs dynamically populated from the tool registry.
*   **Automatic Sitemaps**: The sitemap.xml file must auto-generate during the build, indexable by Google Search Console.

### 3.3 Privacy & GDPR Compliance
*   **No Server Uploads**: User files must NEVER be uploaded to Vercel or any third-party server.
*   **Zero Database**: No database holds user data. Cookies and local storage are permitted only for UI settings (e.g. theme preference, favorite tools list).
*   **Consent Management**: Integrate a minimal cookie consent banner for Google Analytics/AdSense that fully complies with GDPR/CCPA.

---

## 4. Manifest Structure (Conceptual)

The tool manifest must support the following schema for every tool:
*   `id`: Unique URL slug.
*   `name`: Display name.
*   `description`: Short SEO summary.
*   `category`: One of the pre-defined categories.
*   `tags`: Search tags/aliases.
*   `componentPath`: Pointer to entry component.

---

## 5. Document Boundaries & Relationships

*   **Derived from**: [docs/vision.md](./vision.md)
*   **Guides**: [docs/architecture.md](./architecture.md) (which designs systems to meet these requirements) and [docs/tech-stack.md](./tech-stack.md) (which chooses packages satisfying these requirements).
*   **Excludes**: Routing logic implementation details, folder syntax names, Git commands, or code structures.
