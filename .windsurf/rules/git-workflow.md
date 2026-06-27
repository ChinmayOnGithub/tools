# Rule: Git Workflow & Issue Integration

*   **Rule ID**: WS-RULE-004
*   **Target Scope**: Git branch names, commit messages, pull requests, and issue trackers.
*   **Highest Authority**: [docs/tech-stack.md](../../docs/tech-stack.md)

---

## 1. Objective

To establish a transparent, auditable history of the codebase and ensure that every change made by the AI is traced back to a specific user-approved issue.

---

## 2. Mandatory Practices

### Branching Policy
*   All development must take place on dedicated feature branches branched from `main`.
*   Branch naming format: `<type>/<issue-id>-<short-description>`
    *   Examples: `feature/12-pdf-compressor`, `bugfix/45-count-mismatch`, `chore/9-update-prettier`.

### Commit Conventions (Conventional Commits)
*   Every commit must follow the Conventional Commit schema: `<type>(<scope>): <description>`
    *   `feat`: A new feature or tool.
    *   `fix`: A bug fix in a tool or layout.
    *   `docs`: Changes to documentation files in `/docs` or comments.
    *   `style`: Code styling adjustments (Prettier format, spacing).
    *   `refactor`: Code reorganization with no feature additions.
    *   `test`: Adding or correcting tests.
    *   `chore`: Tooling, configs, or package updates.
*   Examples:
    *   `feat(json-tool): add JSON minify functionality`
    *   `docs(ADR): record dynamic routing decision`

### GitHub MCP & Issues
*   Use the GitHub MCP tool to view, create, or update issues prior to working.
*   Every Pull Request description must contain:
    1.  A detailed list of files changed and the rationale.
    2.  A verification log of how the change was tested.
    3.  A closing hook referring to the issue (e.g. `Closes #12`).

### CI/CD Quality Gates
*   All Pull Requests must trigger the GitHub Actions validation check. 
*   PR merge blocks must remain active until linting, typechecking, and Vitest runs compile with 100% success.

---

## 3. Prohibited Practices

*   **NO Direct Main Commits**: Committing directly to the `main` branch is strictly prohibited.
*   **NO Automatic Merges**: AI agents must never merge PRs. Only the human developer is authorized to perform merges.
*   **NO Unlinked Commits**: Commits must have a clear scope and description. Avoid generic messages like `wip`, `update code`, or `fix bugs`.

---

## 4. Validation Checklist

- [ ] Is the current branch name correctly formatted with the issue identifier?
- [ ] Do all commit messages conform to the Conventional Commits syntax?
- [ ] Does the generated PR contain a clear description, manual testing steps, and a `Closes #[issue]` tag?
- [ ] Has the GitHub Actions CI pipeline compiled without failures?
- [ ] Has the PR been submitted for manual developer approval and merge?
