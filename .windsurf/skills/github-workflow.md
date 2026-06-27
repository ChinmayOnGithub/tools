# Skill: GitHub Workflow Integration

*   **Skill ID**: WS-SKILL-004
*   **Target Scope**: GitHub Issues, Pull Requests, Project Boards, Commits.
*   **Mandatory Rule Reference**: [git-workflow.md](../rules/git-workflow.md)

---

## 1. Purpose

To define the workflow for managing branches, tracking work items on a project board, drafting commits, and staging Pull Requests using the GitHub MCP tool.

---

## 2. Inputs

*   A specific task or bug related to a tracking Issue ID.
*   Modified workspace files.

---

## 3. Workflow

1.  **Branch Check & Checkout**:
    *   Verify the current branch name match the pattern: `<type>/<issue-id>-<short-description>`.
2.  **State Synchronization**:
    *   Use GitHub MCP to set the associated issue status to "In Progress" in the Project Board.
3.  **Commit Formatting**:
    *   Stage files incrementally.
    *   Commit changes with Conventional Commit prefixes:
        *   `git commit -m "feat(image-tool): implement crop functionality"`
4.  **Pull Request Creation**:
    *   Push the branch to the remote origin.
    *   Use GitHub MCP to draft a Pull Request with details:
        *   **Title**: Standard Conventional Commit format.
        *   **Body**: Describe the changes, the problem solved, and link the issue using closing syntax (`Closes #ID`).
5.  **Review Request**:
    *   Alert the developer that the PR is ready for manual review and merge.

---

## 4. Expected Output

*   Pushed git commits on a remote branch.
*   A created Pull Request referencing the resolved issue.
*   An updated Project Board state.

---

## 5. Completion Checklist

- [ ] Does the branch name match the standard pattern?
- [ ] Are all commits written using Conventional Commit headers?
- [ ] Does the PR body link to the tracking issue with a closing tag?
- [ ] Is the issue status marked correctly on the Project board?
