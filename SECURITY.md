# Security & Privacy Policy

CoolTools is designed as a **privacy-first, local-only browser platform**. This document describes the security controls, privacy guidelines, and vulnerability reporting procedures.

---

## 1. Local-First Privacy Architecture
Unlike online tools that upload files to external servers, CoolTools runs 100% of its utility operations inside your browser memory context:
* **Zero Uploads**: File processors (such as PDF compilers, image resizers, and key encoders) ingest files directly into the browser's Sandbox.
* **Sandbox Web Worker Processing**: Large operations (like Ghostscript WebAssembly PDF Compression) execute in a decoupled Web Worker thread.
* **FS Garbage Collection**: Virtual filesystem file pointers (MEMFS) are immediately unlinked (`unlink`) inside the worker context after reading outputs. Output buffers are transferred (not cloned) to prevent memory accumulation.

---

## 2. Content-Security-Policy (CSP)
We enforce a strict Content Security Policy to prevent cross-site scripting (XSS), script injections, and clickjacking attacks:
* **Production Script Restrictions**: The `'unsafe-eval'` directive is dynamically removed in production builds, restricting it only to development mode (needed for React Fast Refresh).
* **Connect Whitelist**: Outgoing requests are strictly limited to verified telemetry portals (Google Tag Manager and Microsoft Clarity).
* **Frame Ancestors**: Embedded frames are restricted (`frame-ancestors 'none'`) to prevent clickjacking overlays.

---

## 3. GDPR compliance & Consent Management
We respect user privacy and enforce strict telemetry opt-in directives:
* **Initial Cookie-Free Tracking**: Third-party tracking cookies (such as Microsoft Clarity `_clsk` and `_clck`) are blocked on initial load.
* **Dynamic Consent update**: Outgoing analytics and cookies are only initialized when the visitor explicitly clicks "Accept" on the cookie consent banner.

---

## 4. Scraper Prevention
We block AI search scrapers and LLM training crawlers in `robots.txt` to secure developer content. Blocked user-agents include:
`GPTBot`, `Google-Extended`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, `Applebot-Extended`, `Bytespider`, `Meta-ExternalAgent`, `AmazonBot`, and `cohere-ai`.

---

## 5. Reporting a Vulnerability
We welcome reports from white-hat security researchers. If you identify a security issue, please notify us using our standard security coordinates:
* **Vulnerability Reporting**: Submit an issue via our Github repository at: `https://github.com/ChinmayOnGithub/tools/issues`
* **Security.txt Standard**: Verified reporting coordinates are published at `/.well-known/security.txt`.
