# Rule: Security & Privacy

*   **Rule ID**: WS-RULE-006
*   **Target Scope**: Client calculations, script tags, cookie management, third-party libraries.
*   **Highest Authority**: [docs/vision.md](../../docs/vision.md) (privacy-first commitment).

---

## 1. Objective

To protect user confidentiality by ensuring that no document, image, text, or file processed by the platform is uploaded to a remote server. The platform must operate under a zero-trust model regarding user files.

---

## 2. Mandatory Practices

### Local Processing Assurance
*   All file reading must occur using standard browser APIs: `FileReader`, `Blob`, `createObjectURL`.
*   Verify that no HTTP requests are triggered during the execution phase of any tool.

### HTML & Script Sanitization
*   If a tool displays user-supplied HTML or Markdown outputs (e.g., a Markdown previewer or JSON validator), you must run it through a sanitizer library (such as `dompurify` or a secure parser) before rendering it to the DOM.
*   All script inclusion (e.g., Google Analytics, AdSense) must follow strict Content Security Policy (CSP) guidelines as defined in [docs/tech-stack.md](../../docs/tech-stack.md).

### Telemetry Restrictions
*   Google Analytics must only track Page Views, Category navigation, and Tool Load events.
*   You are **strictly prohibited** from logging user inputs, document names, text sizes, or the output results of any tool calculations.

---

## 3. Prohibited Practices

*   **NO Server-Side APIs**: Never configure API routes that receive document payloads or input files.
*   **NO Third-Party CDN Scripts**: External JS libraries must be bundled inside the project via pnpm dependencies and compiled into the local Next.js client pack. Do not load raw CDN files (`<script src="https://cdn.../...js">`) except for Google-managed services (AdSense/Analytics) specified in the CSP.
*   **NO Persistent File Caching**: User uploads must only exist in-memory (RAM) or dynamic temporary state variables. Do not cache raw file contents in persistent localStorage or IndexedDB without explicit, transient cleanup routines.

---

## 4. Validation Checklist

- [ ] Does the tool function perfectly with network access disabled (Offline Mode)?
- [ ] Are all DOM-injection strings sanitized before rendering?
- [ ] Does Google Analytics tracking verify that zero user inputs or file metadata are captured?
- [ ] Are all dependencies downloaded and compiled locally instead of loaded via external script links (excluding allowed Google domains)?
