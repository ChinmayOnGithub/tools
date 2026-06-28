# Repository Quality & Security Automation

This document outlines the automated quality gates, security scanners, and scheduled audits integrated into the repository to maintain high engineering standards.

---

## 1. Automated Scanners Overview

### 🔍 Semgrep (SAST)
*   **Purpose**: Static Application Security Testing (SAST). Scans source code patterns to identify logical errors, security vulnerabilities, and bad practices.
*   **Target Rule Sets**: JavaScript, TypeScript, React, Next.js, and OWASP Top 10 guidelines.
*   **Trigger Schedule**: Every push to `main` branch, manually via `workflow_dispatch`, and in the Sunday weekly audit.

### 🔑 GitLeaks (Secrets Detection)
*   **Purpose**: Scans git commit history and filesystems to detect hardcoded credentials, API keys, private certificates, tokens, or encryption keys.
*   **Action**: Blocks the pipeline if any confirmed secrets are detected.
*   **Trigger Schedule**: Every push to `main` branch, and in the weekly audit.

### 📦 Trivy (Vulnerability Scanner)
*   **Purpose**: Scans project lockfiles (`pnpm-lock.yaml`) for known CVEs, outdated packages, and configuration vulnerabilities.
*   **Trigger Schedule**: Weekly scheduled runs and automated audits.

### 🏆 OSSF Scorecard
*   **Purpose**: Evaluates the repository against Open Source Security Foundation (OSSF) health checks (including branch protection, dependency updates, token privileges, and pinned actions).
*   **Trigger Schedule**: Weekly scheduled runs and audits.

---

## 2. Local Execution Guidelines

To verify repository quality before pushing, you can execute the security scanners and compiler gates locally:

### ⚙️ Run Standard Quality Gates
Ensure these pass cleanly before any commit:
```bash
# 1. Registry Compliance
node scripts/validate-tools.js

# 2. Syntax Standard & formatting
pnpm run lint

# 3. Compiler Typecheck
pnpm run typecheck

# 4. Test Suite Execution
pnpm run test

# 5. Production Compiler Build
pnpm run build
```

### 🛡️ Run Security Scanners Locally

#### Semgrep Local Run
Install Semgrep via Python's package manager:
```bash
pip install semgrep
semgrep scan --config auto
```

#### GitLeaks Local Run
Install GitLeaks (via Brew/Chocolatey or binary download):
```bash
# Scan unstaged changes
gitleaks protect --verbose

# Scan full git history
gitleaks detect --verbose
```

#### Trivy Local Run
Install Trivy (via package manager or binary download):
```bash
# Scan npm dependencies in root folder
trivy fs .
```

---

## 3. Suppressing False Positives

> [!IMPORTANT]
> Suppressions should only be applied after thorough engineering review has confirmed the finding carries zero security risk.

### Semgrep Suppression
Add an inline comment with a `nosemgrep` directive specifying the rule to bypass:
```typescript
// nosemgrep: javascript.express.security.audit.x-powered-by
res.setHeader('X-Powered-By', 'Secure-App');
```

### GitLeaks Suppression
Add the `.gitleaksignore` file in the root directory to define ignore paths or specific commit hashes, or add a comment inline containing `gitleaks:allow`:
```typescript
const dummyKey = "gitleaks:allow" // This is a simulated test key
```

### Trivy Suppression
Define ignored vulnerability IDs inside a `.trivyignore` file located in the root directory:
```text
# Ignore temporary development CVE in local environment
CVE-2026-12345
```
