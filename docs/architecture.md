# System & Project Architecture

*   **Document Path**: [docs/architecture.md](./architecture.md)
*   **Highest Authority Reference**: [docs/requirements.md](./requirements.md) (translates product requirements to technical design).
*   **Primary Reader**: Lead Architect, Developer, AI Assistant.

---

## 1. Architectural Philosophy

The platform operates on two central philosophies to support hundreds of tools with a single maintainer:

### 1.1 Plugin Tool Model
Every tool in the system must be a self-contained module (a "plugin"). 
*   A new tool must NOT require editing root navigation, creating new routing directories, or modifying root layouts.
*   Adding a tool is achieved by creating a folder in `src/components/tools/[tool-slug]` containing the logic, and registering it in `src/config/tools-registry.ts`.

### 1.2 Zero-Server Compute (Client-Only Execution)
To maintain the low-cost Google AdSense model:
*   The server (Vercel edge) strictly serves static HTML, CSS, client JS, and assets.
*   The client browser performs 100% of processing (PDF merges, image cropping, parsing, conversions) using WebAssembly, client libraries, and Web Workers.

---

## 2. Rendering & Routing Strategy

```
                          ┌──────────────────────────┐
                          │  src/config/registry.ts  │
                          └─────────────┬────────────┘
                                        │ (Reads Registry)
                                        ▼
                          ┌──────────────────────────┐
                          │  app/tools/[slug]/page   │
                          └─────────────┬────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         ▼ (Static Param Build)        ▼ (next/dynamic Lazy Load)
             ┌──────────────────────┐      ┌─────────────────────────┐
             │ generateStaticParams │      │ Dynamic Tool Component  │
             └──────────────────────┘      └─────────────────────────┘
```

### 2.1 Routing Structure
The platform utilizes Next.js App Router with a dynamic catch-all route to serve all tools:
*   Route: `app/tools/[slug]/page.tsx`
*   This single file reads the `tools-registry.ts` and maps the `slug` to the dynamic component.

### 2.2 Static Site Generation (SSG)
During the build phase, `generateStaticParams()` dynamically fetches the list of slugs from the registry and pre-renders every tool landing page as a static HTML page.
*   Benefits: Instant loads, optimal SEO, zero-cost static hosting.

### 2.3 Lazy Loading Components
Inside `app/tools/[slug]/page.tsx`, the tool component is imported using Next.js `dynamic()` (code-splitting) with loading skeletons.
*   Benefits: The client only downloads the JavaScript required for the specific tool they are using, keeping the initial bundle size tiny.

---

## 3. Folder & Component Philosophy

All application files reside under `/src`. The project uses a strict, flat boundary system:

```
src/
├── app/                  # Next.js App Router (Layouts, Routing)
├── components/
│   ├── ui/               # Global shadcn/ui components (Buttons, Cards, Inputs)
│   ├── shared/           # Core layout components (Header, Footer, Sidebar, AdContainer, ErrorBoundary)
│   └── tools/            # Isolated plugin directories
│       └── [tool-slug]/  # Self-contained tool code
│           ├── locales/  # i18n JSON files
│           │   └── en.json
│           ├── index.tsx # Tool entry component (Default Export)
│           ├── worker.ts # (Optional) Web Worker for heavy computing
│           └── utils.ts  # (Optional) Tool-specific helper functions
├── config/
│   └── tools-registry.ts # The single catalog for registering all tools
└── lib/                  # Shared utility code (analytics, core canvas/string utils)
```

---

## 4. Quality & Verification Architecture

### 4.1 Testing Strategy (Vitest)
*   To prevent regressions across tools as they scale, we run unit testing using **Vitest**.
*   All pure functions and calculations (e.g. word counters, math modules, base64 algorithms) must have an adjacent `.test.ts` file.
*   We prioritize unit tests over heavy E2E tests (Playwright) to minimize setup and run complexity for a single developer. Playwright is excluded from the MVP.

### 4.2 Client Hydration Guard Pattern
*   Because the site uses static pre-rendering, reading from browser features (`window`, `localStorage`, theme preference) directly during render causes dynamic HTML mismatch errors.
*   All components reading client-side storage must implement a **Client Hydration Guard**:
    ```typescript
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return <SkeletonLoader />; // Render layout-safe skeleton first
    ```

### 4.3 React Error Boundary Layout
*   Calculations in browser environments (e.g. processing large files) are prone to runtime memory errors.
*   The catch-all page `app/tools/[slug]/page.tsx` must wrap dynamic tool components inside a React `<ErrorBoundary>` component.
*   If a tool script crashes, the boundary catches the error, logs it to Google Analytics, and renders a clean "Reset Tool" reset card instead of crashing the site shell.

---

## 5. Script & Ad performance Strategy

### 5.1 CLS Prevention
*   Google AdSense components must occupy fixed-aspect-ratio containers (`<AdContainer>`) initialized with standard sizes (`min-h-[250px]`) to ensure Cumulative Layout Shift (CLS) remains `0.0`.

### 5.2 Thread-Blocking Prevention (INP)
*   To protect the **Interaction to Next Paint (INP)** metric from heavy script overhead, Google AdSense tags must be loaded asynchronously using Next.js `<Script>` with `strategy="lazyOnload"` or deferring execution until browser idle callback events trigger.

---

## 6. Internationalization (i18n) Strategy

To avoid the configuration complexity of runtime Next.js locale routing on static builds, we use a **JSON Dictionary Dictionary** pattern:
*   All text strings in a tool must be stored in translation JSON files inside `src/components/tools/[tool-slug]/locales/` (e.g., `en.json`).
*   Tool UI logic imports this file to display labels.
*   This separates text from logic from day one, allowing easy retrofitting of sub-path translation routing later without changing UI logic.

---

## 7. Shared Module & Core Lib Philosophy

*   **DRY vs. Isolation**: We prioritize isolation over premature abstraction. If two tools need a similar utility, duplicate it inside their local `utils.ts` files first. Move it to `src/lib/` ONLY if it is used by more than 5 tools or forms a core foundation (e.g. file downloads, string sanitization).
*   **Zero Global State**: Global state management (Redux, Zustand) is prohibited. State must flow down from the tool's root component (`index.tsx`). Shareable inputs (e.g., input values for tools) must be persisted in the URL query string to enable sharing.

---

## 8. Browser vs. Server Responsibilities

| Dimension | Server (Vercel Static Hosting) | Browser (Client Processing) |
| :--- | :--- | :--- |
| **Compute** | None (Static Asset Delivery) | 100% (Calculations, file edits, compilation) |
| **SEO & Routing** | Generates static HTML, Sitemap.xml, RSS | Decodes query parameters, manages router state |
| **State** | Stateless | LocalStorage (preferences), URL Query params (app state) |
| **Analytics & Ads** | None | Google Analytics, Google Tag Manager, Google AdSense |

---

## 9. Dependency Philosophy

*   **Low Dependency Footprint**: Adding third-party NPM packages is restricted. Use browser APIs first (e.g., `CanvasAPI`, `CryptoAPI`, `FileReader`).
*   **Validation**: Any package added must be tree-shakable, lightweight, and execute completely on the client side. Node-specific packages (using `fs`, `path`, or `child_process`) are strictly forbidden.

---

## 10. Document Boundaries & Relationships

*   **Subservient to**: None. This document is the ultimate technical architectural authority.
*   **Guides**: [docs/tech-stack.md](./tech-stack.md) (stack deployment configuration) and all rules files inside `.windsurf/rules/`.
*   **Excludes**: Actual component configurations, package names, version keys, and command CLI scripts.
