# Skill: Documentation Maintenance & Sync

*   **Skill ID**: WS-SKILL-003
*   **Target Scope**: Auditing and updating `/docs` markdown files.
*   **Mandatory Rule Reference**: [documentation-standards.md](../rules/documentation-standards.md)

---

## 1. Purpose

To keep documentation synchronized with the current system state, update milestones, record decisions, and repair broken references.

---

## 2. Inputs

*   A change in system capabilities, dependencies, or config file layout.
*   The current set of `/docs/` markdown files.

---

## 3. Workflow

1.  **Detect Documentation Drift**:
    *   Compare the codebase changes with the active descriptions in `docs/architecture.md` and `docs/tech-stack.md`.
2.  **Log Decisions (ADR)**:
    *   If a structural choice was modified, open [docs/decisions.md](../../docs/decisions.md).
    *   Append a new sequential ADR entry (`ADR-XXX`). Update the index at the top.
3.  **Update Roadmap Milestones**:
    *   If a milestone's features have been fully implemented, mark it as completed `[x]` or update status in [docs/roadmap.md](../../docs/roadmap.md).
4.  **Audit References & Links**:
    *   Ensure all links in the modified documents use relative formats and point to valid, existing paths.

---

## 4. Expected Output

*   Clean, updated markdown files in `/docs`.
*   Zero broken references or mismatched milestones.

---

## 5. Completion Checklist

- [ ] Have all architectural decisions been logged in `docs/decisions.md`?
- [ ] Has the milestone status in `docs/roadmap.md` been updated?
- [ ] Have all file path references been checked and verified as valid?
- [ ] Is there zero content duplication after edits?
